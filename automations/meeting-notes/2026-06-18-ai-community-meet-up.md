---
type: automation-output
source: google-calendar/sync-meeting-notes
captured: 2026-06-18
event_id: _c5h3iohgcpj64bb5cpgj2b9kc9h3cbb2cos66bb16ssj8d3170smaoj3c5u6irredtpg
drive_doc: 1U4w0NDcKSh38BKmFGirKThgLbCioLKFup6vvMr_nzxA
---

# Meeting Notes: AI Community Meet Up

> Auto-captured by HOLLOP sync-meeting-notes automation.
> Promote to `interactions/` if this meeting needs follow-up tracking.

## Meta

| Field | Value |
|---|---|
| Date | 2026-06-18 |
| Duration | 15:30–16:45 (75 min) |
| Attendees | johannes.burke@ionos.com |
| Google Meet | https://meet.google.com/tro-zuqo-rao |
| Drive Doc | [AI Community Meet Up - 2026/06/18 15:16 CEST - Notes by Gemini](https://docs.google.com/document/d/1U4w0NDcKSh38BKmFGirKThgLbCioLKFup6vvMr_nzxA) |

## Calendar Description

Event Registration Confirmed
    

    
        
            Dear colleague,
        

        
            You have successfully registered for an event in LUMINA. Please find the specific schedule and location details below:
        


        
            Event Details
            
                
  
    AI Community Meet Up | June
https://meet.google.com/tro-zuqo-rao
  
  
    
      
        
          Date:
                
          6/18/2026 3:30 PM
        
        
          Time:
                
          3:30 PM - 4:45 PM CEST
        
        
          Location:
                
          Online
        
        
          Address:
                
          

        
        
          Room:
                
          
        
      
    
  

            
        

        
            Regards,

            System Admin
        

    

    
        This is an automated message from LUMINA.
    

 CSOD SYSTEM ID:  193810

## Meet Notes

AI Community Meet Up
Invited               
Attachments 
Meeting records (Some recordings unavailable)


Summary
Presentation of agentic workflows and modular personas optimized for developer tasks alongside future scalability strategies.Designing Agentic WorkflowsDevelopment centers on creating modular, markdown-based personas that function as programmed logic. The system prioritizes robust persona reliability over complex, constantly changing toolsets.Integrating Automated Development ToolsThe orchestrator automates task execution through Visual Studio Code with human oversight limited to initial planning and final quality assurance. Shared memory ledgers enable communication between specialized agents.Scaling Knowledge StorageCurrent local knowledge storage provides individual efficiency while future architectural plans target central, cloud-based memory for team-wide collaboration.


Next steps
[Sebastian Mordziol] Finalize document: Complete the current development plan draft before initiating the workflow.
[Sebastian Mordziol] Enhance interface: Improve the readability of the internal agent dialogue display within the graphical tools.
[Sebastian Mordziol, Johannes Burke] Schedule workshops: Plan and organize workshops regarding AI workflows for interested participants.
[Johannes Burke, Sebastian Mordziol] Discuss session setup: Connect to coordinate the planning of the workshops and the follow up session.
[Johannes Burke] Email repository link: Distribute the link to the AI insights project repository to all meeting attendees.
[Johannes Burke] Schedule session: Organize a dedicated follow up session for the AI presentation and workflow.


Details
Did the screenshots in this section make your notes better or worse?
Introduction and Context: Sebastian Mordziol, a senior software developer at Ionos, introduces their background and the start of their journey in developing AI-driven tools since December of last year.
AI Insights Project Overview: Sebastian presents the "AI Insights" project, a public GitHub repository that includes agent personas, a build system, and an agentic workflow designed to automate developer tasks and ease development.

Agent Personas - Recipe Curator: Sebastian uses a "Recipe Curator" persona to demonstrate how highly specific personas—which include equipment lists, nutritional data, and a "tinkerous" mindset—produce superior, more detailed outputs compared to generic prompts.

Persona Structure and Logic: Personas utilize markdown for formatting and structure, which allows AI models to parse information effectively; Sebastian frames the act of writing these instructions as a form of programming that follows a logical workflow.

Components of a Strong Persona: Sebastian explains that effective personas require a mission, identity, operating philosophy, reference data, and constraints; they emphasize using markdown syntax, such as bolding, to create "identity anchors" that keep the model consistent.

Language Considerations: While models can answer in various languages, Sebastian advises creating personas in English to ensure the "concept" anchors are solid, then instructing the persona to match the user's language during interaction.

Integrating Domain Knowledge and Philosophy: Sebastian explains that adding specific domain knowledge and "philosophies" (such as "novelty over familiarity") allows agents to make informed judgment calls and provide creative, personalized results.

Existing Persona Library: The project features several specialized agents, including a Researcher for deep dives, a technical documentation writer, a change log curator, and a "Persona Curator" used to help design new personas.

Iterative Persona Development: Sebastian emphasizes that creating personas is an iterative process where users should refine instructions based on what does not work; they offer a "Persona Creation Guide" to assist others in creating their own personas.

Build System and Portability: To ensure personas are portable across different platforms like Gemini, Claude, and VS Code, Sebastian built a library that renders a core persona template into system-specific configurations, handling the metadata requirements of each tool.

Agentic Workflow Structure: The workflow consists of nine specialized agents, including a planner, project manager, and various technical agents (such as QA and security); the system follows a structured development cycle that includes human intervention points.

Synthesis and Continuous Improvement: At the end of a project, a dedicated synthesis agent generates a summary of the work, including identified technical debt and strategic recommendations, ensuring that insights gained during development are preserved.
Shared Memory and Communication: To facilitate communication between agents, Sebastian implemented a "notebook" system (shared memory) where agents log observations and notes, acting as a platform-independent long-term memory.

Headless Orchestrator and Usage Statistics: Sebastian developed a LangGraph orchestrator that allows workflows to run entirely via the command line; they report having executed approximately 420 plans using this system.

Graphic User Interface (GUI) Features: Sebastian demonstrates a custom UI used for monitoring project progress, reviewing agent synthesis summaries, and accessing a knowledge base where agents store findings for future reference.

Strategic Planning Integration: The system allows for the definition of short and medium-term goals, which the planner agent actively integrates into project work packages to ensure consistency with the user's broader development strategy.

Internal Dialogue and Debugging: The platform stores the internal dialogues of agents during execution, which Sebastian uses to identify misunderstandings and improve persona configurations.

Web UI Functionality: In response to a question from Sascha Hofmann, Sebastian clarifies that the web interface is designed for reviewing synthesis and monitoring orchestration, rather than conducting live chats with LLMs.
Tool Preference and Workflow: Addressing a question from Zahra Zamanian, Sebastian explains a preference for Visual Studio Code over Claude Code because it offers direct access to the codebase and file system, which is essential for planning.
Agent Handover Mechanics: Sebastian clarifies to Zahra Zamanian that communication within the workflow is handled through the notebook/ledger system, while standalone personas are used in isolated conversations to maintain identity integrity.
Visual Studio Code Integration: Sebastian demonstrates using the VS Code chat window to manage agents, copy file paths for the orchestrator, and archive plans in an "implementation history" folder for future reference.

Collaboration and Repository Management: Oliver Hauger inquires about team collaboration; Sebastian explains that they do not connect to Jira, opting instead to keep all project context, plans, and glossaries within the repository so all agents and team members have access to the same information.

Module Structure and Context Management: Sebastian Mordziol explains that the recipients module uses a YAML file containing context, metadata, and a list of related modules. These files include keywords used to generate a glossary, which creates navigational breadcrumbs allowing agents to efficiently locate necessary code and information within the codebase. While this workflow is highly effective for the developer's needs, Sebastian Mordziol notes that it functions best when users adjust it to fit their specific requirements and existing workflows.

Project Documentation Storage: Catalin Bucur asks about the nature of the shared notebook and project notebooks. Sebastian Mordziol clarifies that these utilize JSON storage within a dedicated folder. Crucially, the original plan and synthesis documents are archived into the notebook at the conclusion of a project, ensuring these records persist regardless of whether they are committed to Git.

Agentic Workflow and Human Interaction: Huiying Duan questions the nature of the nine-step agentic workflow and the extent of human involvement. Sebastian Mordziol clarifies that human interaction is limited to the initial planning step and the final review of the output. Once the orchestrator is initiated in Visual Studio, the execution of the project is automated.
Rework Mode and Synthesis: In the event that a user is dissatisfied with the project outcome, a rework plan can be initiated. Sebastian Mordziol explains that by providing the synthesis document to the planner agent, it enters "rework mode." The agent then references the MCP (Model Context Protocol) server and knowledge base to identify specific issues or additions that need to be addressed, effectively minimizing manual developer effort.

Developer Productivity: Sebastian Mordziol reflects on the impact of the workflow, noting that since the beginning of February, the agents have handled the development work. This transition allows the developer to focus primarily on high-level tasks such as planning, ensuring robust plan structures, and performing final quality assurance testing.

Persona Design and Management: Sascha Hofmann inquires about the starting point for developing agent personas. Sebastian Mordziol explains that the AI Insights project includes a persona design guide and a "Persona Curator" agent. This curator can take feedback from the user to refine the persona's markdown configuration and address repeated errors. Furthermore, personas are versioned with change logs to track and improve their performance over time.
Multi-Environment Persona Configuration: Oliver Hauger asks if personas can be applied across different environments. Sebastian Mordziol demonstrates that the AI Insights project includes a library that generates agent files formatted specifically for systems like Visual Studio Code and Cloud Code from a unified source folder. This ensures that metadata and file naming conventions remain consistent regardless of the target platform.
Customization and Philosophy of Personas: Sebastian Mordziol emphasizes that personas should be tailored to an individual's unique working philosophy. Because different developers may follow distinct methodologies—such as those using Jira tickets—the system is designed to be flexible. This allows users to create agents that align with their personal workflows rather than conforming to a one-size-fits-all model.
Community Engagement and Future Sessions: Johannes Burke and Sebastian Mordziol discuss the potential for future workshops to help others implement these workflows. Johannes Burke characterizes the system as an "AI symphony" and plans to organize a follow-up session to explore these capabilities further, as there is significant interest from the participants.
Architectural Philosophy: Isayah Young-Burke commends the architecture of the system as being advanced compared to standard enterprise chatbot operations. Sebastian Mordziol clarifies that the project's focus is on the "basics," prioritizing the development of robust, reliable personas over relying on complex prompt engineering or frequently changing tools.
Scaling Knowledge Storage: Isayah Young-Burke proposes the idea of an autonomous, self-learning memory system where session analyses contribute to new skills. Sebastian Mordziol acknowledges this as a strong concept. They note that while current knowledge storage is local and individualistic, a logical next step for future development would be transitioning this knowledge to a central, cloud-based store to enable team collaboration.


You should review Gemini's notes to make sure they're accurate. Get tips and learn how Gemini takes notes
How is the quality of these specific notes? Take a short survey to let us know your feedback, including how helpful the notes were for your needs.

## Follow-up

> _Review and add any action items to `ops/todo.md`._

- [ ] _(add action items here)_

---
*Auto-generated: 2026-06-18T16:18:16.579Z*
