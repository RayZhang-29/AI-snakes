package com.AI_snakes.backend.controller.bot;

import com.AI_snakes.backend.pojo.Bot;
import com.AI_snakes.backend.service.user.bot.GetListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
public class GetListController {
    @Autowired
    private GetListService getListService;

    @GetMapping("/user/bot/getlist")
    public List<Bot> getList() {
        return getListService.getList();
    }
}
