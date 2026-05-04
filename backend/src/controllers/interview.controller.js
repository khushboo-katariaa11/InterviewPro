const pdfParse = require("pdf-parse")
const { generateInterviewReport } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    // Extract job title from job description (first line or use a default)
    const jobTitle = interViewReportByAi.title || jobDescription.split('\n')[0].replace(/^[^A-Za-z0-9]*/g, '') || "Job Position"

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        title: jobTitle,
        ...interViewReportByAi
    })
    console.log("AI RESPONSE:", interViewReportByAi);
    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}



module.exports = { generateInterViewReportController }