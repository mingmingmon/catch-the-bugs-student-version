package dev.roomfor;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;
import java.nio.file.Path;
import static org.assertj.core.api.Assertions.assertThat;

class PersistenceTest {
    @TempDir Path directory;

    private ConfigurableApplicationContext start(String database) {
        String url = "jdbc:h2:file:" + directory.resolve(database).toAbsolutePath()
            + ";DATABASE_TO_LOWER=TRUE;DB_CLOSE_ON_EXIT=FALSE";
        return new SpringApplicationBuilder(Application.class).web(WebApplicationType.NONE).run(
            "--spring.datasource.url=" + url,
            "--spring.main.banner-mode=off",
            "--logging.level.root=WARN");
    }

    @Test void preservesDataAcrossRestartAndSeparatesDatabases() {
        try (var first = start("first")) {
            first.getBean(JdbcTemplate.class).update("UPDATE rooms SET name=? WHERE id=1", "저장된 공간");
        }
        try (var restarted = start("first")) {
            var db = restarted.getBean(JdbcTemplate.class);
            assertThat(db.queryForObject("SELECT name FROM rooms WHERE id=1", String.class)).isEqualTo("저장된 공간");
            assertThat(db.queryForObject("SELECT COUNT(*) FROM rooms", Integer.class)).isEqualTo(3);
        }
        try (var second = start("second")) {
            var db = second.getBean(JdbcTemplate.class);
            assertThat(db.queryForObject("SELECT name FROM rooms WHERE id=1", String.class)).isEqualTo("포커스룸");
        }
    }
}
