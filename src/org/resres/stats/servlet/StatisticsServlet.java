package org.resres.stats.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.grayleaves.problem.ProblemBuilder;
import org.grayleaves.problem.ProblemEnum;
import org.grayleaves.problem.ProblemException;
import org.grayleaves.problem.ResetStateForTestingException;
import org.grayleaves.problem.Teacher;





/**
 * Servlet implementation class StatisticsServlet
 */
@WebServlet("/StatisticsServlet")
public class StatisticsServlet extends HttpServlet {
	protected static final String TEACHER = "teacher";
	private static final long serialVersionUID = 1L;
       
    public StatisticsServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response); 
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession(true); //TODO verify correct method
		Enumeration<String> parameterNames = request.getParameterNames(); 
		String jsonInput = parameterNames.nextElement(); 
		printParameters(request, jsonInput);
		Teacher teacher = getTeacher(session); 
		String jsonOutput = "{}"; 
		try 
		{
			jsonOutput = teacher.updateProblem(jsonInput); 
		}
		catch (ResetStateForTestingException e)
		{
			System.out.println(e.getMessage());
			forceNewTeacherCreationAtNextRequest(session);
		}
		session.setMaxInactiveInterval(600); 
//		response.setContentType("text/plain"); 
		response.setContentType("application/json"); 
		PrintWriter out = response.getWriter(); 
		out.print(jsonOutput); 
	}

	protected void forceNewTeacherCreationAtNextRequest(HttpSession session)
	{
		session.setAttribute(TEACHER, null);
	}

	protected void printParameters(HttpServletRequest request, String jsonInput)
	{
		if (jsonInput != null) System.out.println("input:  "+jsonInput);
//		Map<String, String[]> map = request.getParameterMap(); 
//		if (map != null)
//		{
//			Set<Entry<String, String[]>> entries = map.entrySet(); 
//			for (Entry<String, String[]> entry : entries)
//			{
//				System.out.println("entry key: "+entry.getKey());
//				for (int i = 0; i < entry.getValue().length; i++)
//				{
//					System.out.println("value "+i+": "+entry.getValue()[i]);
//				}
//			}
//		}
	}

	public Teacher getTeacher(HttpSession session)
	{
		Teacher teacher = (Teacher) session.getAttribute(TEACHER);
		if (teacher == null) 
		{
			teacher = buildTeacher(); 
			session.setAttribute(TEACHER, teacher); 
		}
		return teacher;
	}
	protected Teacher buildTeacher()
	{
		Teacher teacher = new Teacher();
		ProblemBuilder builder = new ProblemBuilder(); 
		builder.setTeacher(teacher); 
		try
		{
			teacher.addProblem(builder.buildProblem(ProblemEnum.BASIC_STATISTICS));
		}
		catch (ProblemException e)
		{
			e.printStackTrace();
		} 
		return teacher;
	}

	public String getInterfaceUpdate()
	{
		return null;
	}


}
