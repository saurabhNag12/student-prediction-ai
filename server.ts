import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

import { SageMakerRuntimeClient, InvokeEndpointCommand } from "@aws-sdk/client-sagemaker-runtime";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize SageMaker Client (Optional - based on env)
const sagemaker = process.env.AWS_ACCESS_KEY_ID ? new SageMakerRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
}) : null;

// Gemini AI removed - using local rule-based fallback instead

// API Endpoints
app.post("/api/predict", async (req, res) => {
  try {
    const { attendance, study_hours, assignment_score, internal_marks, previous_sem_score, stream = "pcm" } = req.body;

    // 1. Try AWS SageMaker first if configured (Note: Standard CSV deployment remains compatible)
    if (sagemaker && process.env.SAGEMAKER_ENDPOINT_NAME) {
      try {
        const payload = `${attendance},${study_hours},${assignment_score},${internal_marks},${previous_sem_score}`;
        const command = new InvokeEndpointCommand({
          EndpointName: process.env.SAGEMAKER_ENDPOINT_NAME,
          ContentType: "text/csv",
          Body: Buffer.from(payload),
        });

        const response = await sagemaker.send(command);
        const resultString = new TextDecoder().decode(response.Body);
        
        // Return SageMaker result
        return res.json({
          performance: resultString.trim().replace(/[\[\]"]/g, ""),
          confidence: 95, 
          improvement_tip: "Data retrieved from live SageMaker ML Model."
        });
      } catch (awsError) {
        console.warn("AWS SageMaker failed, falling back to local engine:", awsError);
      }
    }

    // 2. Fallback to Local Rule-Based Logic if AWS is not configured or fails
    // Calculate a rough score to determine category
    const maxPossible = 100 + 50 + 100; // Assignment + Internal + Prev Sem
    const actualScore = Number(assignment_score) + Number(internal_marks) + Number(previous_sem_score);
    const scorePercentage = (actualScore / maxPossible) * 100;
    
    // Factor in attendance and study hours
    const attendanceFactor = Number(attendance) / 100;
    const finalScore = scorePercentage * attendanceFactor + (Number(study_hours) * 0.5);

    let performance = "Essential Repeat";
    let tip = "Critical academic intervention required. Focus on increasing attendance to sit for Board exams and get core subject support.";
    let confidence = Math.round(70 + Math.random() * 20);
    
    if (finalScore >= 75) {
      performance = "Distinction";
      tip = "Outstanding academic standing! You have exceptional mastery; maintain this pace to secure top ranks in Board exams.";
    } else if (finalScore >= 60) {
      performance = "First Division";
      tip = "Strong performance. Concentrating on weekly unit tests and practical writing will comfortably push you into the Distinction bracket.";
    } else if (finalScore >= 50) {
      performance = "Second Division";
      tip = "Satisfactory progress. Increasing self-study hours and practicing past papers will help elevate you to a First Division.";
    } else if (finalScore >= 35) {
      performance = "Third Division";
      tip = "Pass category. Immediate regular revision and solving NCERT questions is highly recommended to improve subject grasp.";
    }

    // Dynamic subject-wise estimation logic based on parameters (Indian Science Stream)
    const studyFactor = Math.min(10, Number(study_hours)) / 10;
    const assignmentFactor = Number(assignment_score) / 100;
    const prevSemFactor = Number(previous_sem_score) / 100;
    const internalFactor = Number(internal_marks) / 50;

    let subjects: Record<string, number> = {};
    if (stream === "pcb") {
      subjects = {
        biology: Math.round(42 + (prevSemFactor * 32) + (studyFactor * 16) + (internalFactor * 10)),
        physics: Math.round(38 + (assignmentFactor * 32) + (studyFactor * 18) + (prevSemFactor * 12)),
        chemistry: Math.round(42 + (attendanceFactor * 20) + (prevSemFactor * 22) + (studyFactor * 16)),
        english: Math.round(45 + (attendanceFactor * 25) + (prevSemFactor * 20) + (studyFactor * 10)),
        physical_education: Math.round(40 + (assignmentFactor * 35) + (studyFactor * 20) + (internalFactor * 5))
      };
    } else {
      subjects = {
        math: Math.round(40 + (prevSemFactor * 30) + (studyFactor * 20) + (internalFactor * 10)),
        physics: Math.round(38 + (assignmentFactor * 32) + (studyFactor * 18) + (prevSemFactor * 12)),
        chemistry: Math.round(42 + (attendanceFactor * 20) + (prevSemFactor * 22) + (studyFactor * 16)),
        english: Math.round(45 + (attendanceFactor * 25) + (prevSemFactor * 20) + (studyFactor * 10)),
        computer_science: Math.round(35 + (assignmentFactor * 35) + (studyFactor * 25) + (internalFactor * 5))
      };
    }

    // Clamp subject scores to 100 and minimum 0
    Object.keys(subjects).forEach(key => {
      subjects[key] = Math.max(0, Math.min(100, subjects[key]));
    });

    // Calculate entrance readiness indices
    let entrance_readiness = "";
    if (stream === "pcb") {
      const biologyScore = subjects.biology || 50;
      const physicsScore = subjects.physics || 50;
      const chemistryScore = subjects.chemistry || 50;
      const baseNEET = 180 + (biologyScore * 2.2) + (physicsScore * 1.2) + (chemistryScore * 1.2) + (Number(study_hours) * 8);
      const neetScore = Math.max(180, Math.min(720, Math.round(baseNEET)));
      entrance_readiness = `NEET Forecast: ${neetScore}/720 Marks`;
      if (neetScore >= 600) {
        tip += ` You are on track for a premier government medical college seat (NEET est: ${neetScore}+)!`;
      } else {
        tip += ` Focus on Biology (NCERT line-by-line) and active recall for organic naming reactions to elevate your NEET estimate (${neetScore}/720) to 600+.`;
      }
    } else {
      const mathScore = subjects.math || 50;
      const physicsScore = subjects.physics || 50;
      const chemistryScore = subjects.chemistry || 50;
      const baseJEE = 50 + (mathScore * 0.2) + (physicsScore * 0.15) + (chemistryScore * 0.1) + (Number(study_hours) * 0.5);
      const jeePercentile = Math.max(50.0, Math.min(99.99, Number(baseJEE.toFixed(2))));
      entrance_readiness = `JEE Main Forecast: ${jeePercentile}%ile`;
      if (jeePercentile >= 95) {
        tip += ` Excellent JEE Main forecast of ${jeePercentile}%ile! Practice mock test series and JEE Advanced previous papers.`;
      } else {
        tip += ` Focus on Calculus, Coordinate Geometry, and high-weightage Physics chapters to push your JEE Main forecast (${jeePercentile}%ile) above 97%ile.`;
      }
    }

    // Derive strengths and vulnerabilities based on the inputs (CBSE / Indian University Context)
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (Number(attendance) >= 85) strengths.push("Regular classroom presence aligns well with the 75% CBSE mandatory criteria.");
    else if (Number(attendance) < 75) weaknesses.push("Attendance falls below the mandatory 75% CBSE threshold, running the risk of having your admit card withheld.");

    if (Number(study_hours) >= 6) strengths.push("Strong daily study routine provides robust foundation for competitive exam prep (JEE/NEET).");
    else if (Number(study_hours) < 3.5) weaknesses.push("Daily self-study hours are low; dedicate at least 4.5+ hours to match high board syllabus rigour.");

    if (Number(assignment_score) >= 80) strengths.push("Excellent work on practical files, science lab manuals, and external project files.");
    else if (Number(assignment_score) < 60) weaknesses.push("Incomplete practical journals and school record logs are dragging down internal grade potential.");

    if (Number(internal_marks) >= 40) strengths.push("Strong scores in mid-term unit tests and school pre-boards.");
    else if (Number(internal_marks) < 25) weaknesses.push("Low performance in internal pre-boards indicates a need for comprehensive concept revision.");

    if (strengths.length === 0) strengths.push("Demonstrates basic concepts. Maintain solid, continuous revision.");
    if (weaknesses.length === 0) weaknesses.push("No major academic checkpoints. Keep following your daily schedule.");

    res.json({
      performance,
      confidence,
      improvement_tip: tip,
      subject_scores: subjects,
      strengths,
      weaknesses,
      entrance_readiness,
      admit_card_eligible: Number(attendance) >= 75
    });
  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite();
