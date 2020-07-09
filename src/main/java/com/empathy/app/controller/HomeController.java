package com.empathy.app.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HomeController {
	@Autowired
	private Environment env;

	Logger logger = LoggerFactory.getLogger(HomeController.class);

	@GetMapping("/")
	public ModelAndView homePage(Model model) {
		ModelAndView mav = new ModelAndView("/home/home");
		mav.addObject("app-name", env.getProperty("spring.application.name"));
		return mav;

	}

	@GetMapping("/board/{projectID}")
	public ModelAndView getBoard(Model model, @PathVariable String projectID) {

		ModelAndView mav = new ModelAndView("/home/board");
		mav.addObject("appName", env.getProperty("spring.application.name"));
		
		return mav;

	}
	
	@GetMapping("/dashboard")
	public ModelAndView getDashBoard(Model model) {

		ModelAndView mav = new ModelAndView("/home/dashboard");
		mav.addObject("appName", env.getProperty("spring.application.name"));
		
		return mav;

	}

	

	
}
