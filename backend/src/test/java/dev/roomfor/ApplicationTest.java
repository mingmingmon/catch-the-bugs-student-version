package dev.roomfor;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ApplicationTest {
    @Autowired MockMvc mvc;

    @Test void environmentEndpointResponds() throws Exception {
        mvc.perform(get("/api/environment"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").isNotEmpty());
    }

    @Test void healthEndpointResponds() throws Exception {
        mvc.perform(get("/api/health"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test void roomsEndpointReturnsJson() throws Exception {
        mvc.perform(get("/api/rooms"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }
}
