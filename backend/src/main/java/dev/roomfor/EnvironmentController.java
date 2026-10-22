package dev.roomfor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class EnvironmentController {
    private final String name;
    public EnvironmentController(@Value("${app.environment-name}") String name) { this.name = name; }
    @GetMapping("/api/environment")
    public Map<String, String> environment() { return Map.of("name", name); }
}
