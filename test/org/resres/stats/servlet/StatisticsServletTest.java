package org.resres.stats.servlet;

import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.jdbc.pool.interceptor.ResetAbandonedTimer;
import org.grayleaves.problem.Problem;
import org.grayleaves.problem.ResetStateForTestingException;
import org.grayleaves.problem.StatisticsProblem;
import org.grayleaves.problem.StepEnum;
import org.grayleaves.problem.StepException;
import org.grayleaves.problem.StepSequence;
import org.grayleaves.problem.Teacher;
import org.grayleaves.problem.TestingProblem;
import org.grayleaves.problem.TestingStep;
import org.grayleaves.problem.VisibilityEnum;
import org.junit.Before;
import org.junit.Test;

public class StatisticsServletTest
{
	private StatisticsServlet servlet;
	private HttpSession session;
	private HttpServletRequest request;
	private HttpServletResponse response;
	private String jsonInput = "{\"updateJavaClass\":\"org.grayleaves.problem.StatisticsUpdate\",\"id\":0,\"htmlId\":\"addScore0\",\"beforeVisibility\":null,\"afterVisibility\":null,\"beforeValue\":\"value1\",\"afterValue\":\"1.2\",\"updateStep\":\"addScore\",\"index\":0}";
	private String jsonTestInput = "{\"updateJavaClass\":\"org.grayleaves.problem.TestingUpdate\",\"id\":5,\"field\":\"3.5\",\"someArray\":[1,2,9],\"updateStep\":\"testingStep\"}";
//	private String jsonOutput = "{\"testingStep1\":{\"stepSequenceId\":\"testingStep1\",\"visibility\":\"enable\",\"data\":3.5,\"explanation\":\"explanation of data step\",\"dataStepSequenceId\":\"testingStep5\"}}";
	private String jsonOutput = "{\"testingStep1\":{\"stepSequenceId\":\"testingStep1\",\"visibility\":\"enable\",\"data\":3.5,\"explanation\":\"explanation of data step\"}}";
	
	@Before
	public void setUp() throws Exception
	{
		session = new TestingSession(); 
		request = new TestingRequest(session, jsonInput); 
		response = new TestingResponse(); 
		servlet = new StatisticsServlet(); 
	}
	@Test
	public void verifyHasOrCreatesTeacherWithStatisticsProblem() throws Exception
	{
		Teacher teacher = servlet.getTeacher(session);  
		assertNotNull(teacher); 
		assertEquals(teacher, session.getAttribute(StatisticsServlet.TEACHER));
		assertTrue(teacher.getProblems().get(0) instanceof StatisticsProblem);
	}
	@Test
	public void verifyInvokesTeacherWithJsonInputFromFirstParameter() throws Exception
	{
		servlet.doPost(request, response); 
		Teacher teacher = servlet.getTeacher(session);
		StatisticsProblem problem = (StatisticsProblem) teacher.getProblems().get(0); 

		assertEquals(1, problem.getVariable().getScores().size()); 
		assertEquals(1.2, problem.getVariable().getScores().get(0), .001); 
		assertEquals(1, ((StatisticsProblem) teacher.getProblems().get(0)).getVariable().getScores().size()); 
	}
	@Test
	public void verifyReturnsJsonOutput() throws Exception
	{
		request = new TestingRequest(session, jsonTestInput);
		servlet = new TestingStatisticsServlet(false); 
		servlet.doPost(request, response); 
		TestingTeacher teacher = (TestingTeacher) servlet.getTeacher(session); 
		assertEquals(jsonOutput, teacher.jsonOutput); 
	}
	@Test
	public void verifyAllocatesNewSessionIfResetRequestedForTesting() throws Exception
	{
		request = new TestingRequest(session, jsonTestInput);
		servlet = new TestingStatisticsServlet(true); 
		Teacher teacher = servlet.getTeacher(session); 
		servlet.doPost(request, response); 
		Teacher teacher2 = servlet.getTeacher(session); 
		assertNotSame(teacher, teacher2); 
	}
	private class TestingStatisticsServlet extends StatisticsServlet
	{
		private static final long serialVersionUID = 1L;
		private boolean resetRequested;

		public TestingStatisticsServlet(boolean resetRequested)
		{
			this.resetRequested = resetRequested; 
		}

		@Override
		protected Teacher buildTeacher()
		{
			Teacher teacher = new TestingTeacher(resetRequested); 
			Problem problem = new TestingProblem(teacher); 
			teacher.addProblem(problem); 
			StepSequence stepSequence = new StepSequence(StepEnum.TESTING_STEP, "5", problem);  
			stepSequence.addVisibilityAndDataInterfaceUpdate("testingStep1", VisibilityEnum.ENABLED, "testingStep5"); 
			TestingStep step = new TestingStep(teacher, "2.1", 0, true); 
			step.execute(); 
			stepSequence.updateStep(step); 
			try
			{
				problem.addStepSequence(stepSequence);
			}
			catch (StepException e)
			{
				e.printStackTrace();
			}
			return teacher;
		}
	}
	private class TestingTeacher extends Teacher
	{
		public String jsonOutput;  // ok for testing; threading problems likely in real case 
		private boolean resetRequested;
		
		public TestingTeacher(boolean resetRequested)
		{
			super(); 
			this.resetRequested = resetRequested; 
		}

		@Override
		public String updateProblem(String jsonInput)
		{
			if (resetRequested) 
			{
				throw new ResetStateForTestingException("Reset requested"); 
			}
			this.jsonOutput = super.updateProblem(jsonInput); 
			return this.jsonOutput;  
		}
	}
}
