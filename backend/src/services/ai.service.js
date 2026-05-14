const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

// Transform flat array to object array
function transformQuestionsArray(arr) {
    const result = []
    for (let i = 0; i < arr.length; i += 4) {
        if (arr[i + 1] && arr[i + 3]) {  // question and answer must exist
            result.push({
                question: arr[i + 1],
                intention: arr[i + 2] || "To assess your knowledge",
                answer: arr[i + 3] || "Provide a comprehensive answer"
            })
        }
    }
    return result
}

function transformSkillGapsArray(arr) {
    const result = []
    // arr: ["skill_name", "Frontend", "severity", "Medium", ...]
    for (let i = 0; i < arr.length; i += 4) {
        if (arr[i + 1] !== undefined && arr[i + 3] !== undefined) {
            const severity = String(arr[i + 3]).toLowerCase().trim()
            result.push({
                skill: arr[i + 1],
                severity: ["low", "medium", "high"].includes(severity) ? severity : "low"
            })
        }
    }
    return result
}

function transformPreparationPlanArray(arr) {
    const result = []
    // arr: ["day_number", 1, "focus_area", "DSA", "tasks", ["task1", "task2"], ...]
    for (let i = 0; i < arr.length; i += 6) {
        if (arr[i + 1] !== undefined && arr[i + 3] !== undefined) {
            const tasks = Array.isArray(arr[i + 5]) ? arr[i + 5] : [arr[i + 5] || "Review and practice"]
            result.push({
                day: Number(arr[i + 1]) || (result.length + 1),
                focus: arr[i + 3],
                tasks: tasks.filter(t => t)  // Filter out empty tasks
            })
        }
    }
    return result
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `You are an expert interview preparation coach. Analyze the following candidate profile and job description, then generate a comprehensive interview preparation report.

Resume: ${resume}

Self Description: ${selfDescription}

Job Description: ${jobDescription}

Generate ONLY a JSON response with the following EXACT structure:
{
  "matchScore": 85,
  "title": "Job Title Here",
  "technicalQuestions": [
    {
      "question": "...",
      "intention": "...",
      "answer": "..."
    },
    {
      "question": "...",
      "intention": "...",
      "answer": "..."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "...",
      "intention": "...",
      "answer": "..."
    },
    {
      "question": "...",
      "intention": "...",
      "answer": "..."
    }
  ],
  "skillGaps": [
    {
      "skill": "...",
      "severity": "low|medium|high"
    },
    {
      "skill": "...",
      "severity": "low|medium|high"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Day 1 Focus Area",
      "tasks": ["Task 1", "Task 2", "Task 3"]
    },
    {
      "day": 2,
      "focus": "Day 2 Focus Area",
      "tasks": ["Task 1", "Task 2", "Task 3"]
    },
    {
      "day": 3,
      "focus": "Day 3 Focus Area",
      "tasks": ["Task 1", "Task 2", "Task 3"]
    },
    {
      "day": 4,
      "focus": "Day 4 Focus Area",
      "tasks": ["Task 1", "Task 2", "Task 3"]
    },
    {
      "day": 5,
      "focus": "Day 5 Focus Area",
      "tasks": ["Task 1", "Task 2", "Task 3"]
    },
    {
      "day": 6,
      "focus": "Day 6 Focus Area",
      "tasks": ["Task 1", "Task 2", "Task 3"]
    },
    {
      "day": 7,
      "focus": "Day 7 Focus Area - Mock Interview & Review",
      "tasks": ["Task 1", "Task 2", "Task 3"]
    }
  ]
}

IMPORTANT REQUIREMENTS:
- Generate EXACTLY 7 days in preparationPlan (day 1 through day 7)
- Each day must have a unique focus area relevant to interview preparation
- Each day must have at least 2-3 specific, actionable tasks
- Include 5-7 technical questions with complete answers
- Include 5-7 behavioral questions with complete answers
- Include 3-5 skill gaps with appropriate severity levels
- Return ONLY valid JSON. NO additional text.`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    let result = JSON.parse(response.text)
    
    console.log("📋 Raw AI Response Structure:")
    console.log("- technicalQuestions type:", Array.isArray(result.technicalQuestions) ? "array" : typeof result.technicalQuestions)
    console.log("- technicalQuestions[0]:", result.technicalQuestions?.[0])
    console.log("- skillGaps type:", Array.isArray(result.skillGaps) ? "array" : typeof result.skillGaps)
    console.log("- skillGaps[0]:", result.skillGaps?.[0])
    
    // Transform flat arrays to proper object arrays if needed
    if (Array.isArray(result.technicalQuestions)) {
        if (result.technicalQuestions[0] === "question" || typeof result.technicalQuestions[0] === "string") {
            console.log("🔄 Transforming technicalQuestions from flat array")
            result.technicalQuestions = transformQuestionsArray(result.technicalQuestions)
        }
    }
    
    if (Array.isArray(result.behavioralQuestions)) {
        if (result.behavioralQuestions[0] === "question" || typeof result.behavioralQuestions[0] === "string") {
            console.log("🔄 Transforming behavioralQuestions from flat array")
            result.behavioralQuestions = transformQuestionsArray(result.behavioralQuestions)
        }
    }
    
    if (Array.isArray(result.skillGaps)) {
        if (result.skillGaps[0] === "skill_name" || result.skillGaps[0] === "skill" || typeof result.skillGaps[0] === "string") {
            console.log("🔄 Transforming skillGaps from flat array")
            result.skillGaps = transformSkillGapsArray(result.skillGaps)
        }
    }
    
    if (Array.isArray(result.preparationPlan)) {
        if (result.preparationPlan[0] === "day_number" || result.preparationPlan[0] === "day" || typeof result.preparationPlan[0] === "string") {
            console.log("🔄 Transforming preparationPlan from flat array")
            result.preparationPlan = transformPreparationPlanArray(result.preparationPlan)
        }
    }
    
    console.log("🎯 AI Transformed Response:")
    console.log("Match Score:", result.matchScore)
    console.log("Technical Questions:", result.technicalQuestions?.length || 0, "questions")
    console.log("Behavioral Questions:", result.behavioralQuestions?.length || 0, "questions")
    console.log("Skill Gaps:", result.skillGaps?.length || 0, "gaps")
    console.log("Preparation Plan:", result.preparationPlan?.length || 0, "days")

    return result


}



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }