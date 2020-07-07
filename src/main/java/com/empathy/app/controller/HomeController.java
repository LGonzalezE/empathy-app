package com.empathy.app.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;

import com.empathy.api.dto.board.SprintSummary;
import com.empathy.util.JsonUtil;

@Controller
public class HomeController {
	@Autowired
	private Environment env;

	Logger logger = LoggerFactory.getLogger(HomeController.class);

	@GetMapping("/")
	public ModelAndView homePage(Model model) {
		ModelAndView mav = new ModelAndView("/home/home");
		mav.addObject("appName", env.getProperty("spring.application.name"));
		return mav;

	}

	@GetMapping("/board/{projectID}/{sprintID}")
	public ModelAndView getBoard(Model model, @PathVariable String projectID, @PathVariable String sprintID) {

		// get sprint summary
		String uri = env.getProperty("empathy.api.base.url") + env.getProperty("empathy.api.board.sprint.summary.get")
				.replace("{projectID}", projectID).replace("{sprintID}", sprintID);
		logger.debug("empathy.api.board.sprint.summary.get: {}", uri);
		RestTemplate restTemplate = new RestTemplate();

		SprintSummary sprintSummary = restTemplate.getForObject(uri, SprintSummary.class);

		logger.debug("sprintSummary: {}", JsonUtil.toJson(sprintSummary));

		ModelAndView mav = new ModelAndView("/home/board");
		mav.addObject("appName", env.getProperty("spring.application.name"));
		mav.addObject("sprintSummary", sprintSummary);
		return mav;

	}
	
	@GetMapping("/dashboard")
	public ModelAndView getDashBoard(Model model) {

		ModelAndView mav = new ModelAndView("/home/dashboard");
		mav.addObject("appName", env.getProperty("spring.application.name"));
		
		return mav;

	}

	

	
}
