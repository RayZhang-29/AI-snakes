package com.AI_snakes.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
class BackendApplicationTests {

    @Test
    void contextLoads() {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//        System.out.println(passwordEncoder.encode("2018SDzr!"));
//        System.out.println(passwordEncoder.encode("lnx"));
//        System.out.println(passwordEncoder.encode("pszr"));
//        System.out.println(passwordEncoder.matches("lnx", "$2a$10$cXqaOSztE4GT7pmOPOeyX.w2oBqLM4U7pU0VdvrY1syrsNhMjfvz2"));
    }

}
