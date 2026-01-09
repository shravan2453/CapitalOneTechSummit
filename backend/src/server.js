const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuid } = require("uuid");
const { federal, state, privateLoans } = require("./data/loanProducts");
const { allocate, scenarios } = require("./services/allocation");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.get("/api/health", (_, res) => {
  res.json({ ok: true });
});

app.get("/api/loan-products", (_, res) => {
  res.json({ federal, state, private: privateLoans });
});

app.post("/api/profile", (req, res) => {
  const profile = normalizeProfile(req.body || {});
  const allocation = allocate(profile);
  res.json({ profileId: uuid(), profile, allocation });
});

app.post("/api/optimize", (req, res) => {
  const profile = normalizeProfile(req.body || {});
  const result = scenarios(profile);
  res.json({ profileId: uuid(), profile, ...result });
});

function normalizeProfile(body) {
  // Calculate years remaining from year level
  const yearLevelYears = {
    freshman: 4,
    sophomore: 3,
    junior: 2,
    senior: 1
  };
  
  const yearLevel = body.yearLevel || "freshman";
  const yearsRemaining = body.yearsRemaining 
    ? Number(body.yearsRemaining) 
    : (yearLevelYears[yearLevel] || 4);
  
  return {
    // Student profile
    graduationDate: body.graduationDate,
    yearLevel,
    yearsRemaining,
    school: body.school || "",
    program: body.program || "",
    stateOfResidence: body.stateOfResidence || "NC",
    dependencyStatus: body.dependencyStatus || "dependent",
    
    // Financial situation
    annualGap: Number(body.annualGap || body.gap || 0), // COA minus grants/scholarships per year
    annualIncome: Number(body.annualIncome || 50000),   // Expected starting salary
    incomeGrowthRate: Number(body.incomeGrowthRate || 0.03),
    familySize: Number(body.familySize || 1),
    
    // Credit & preferences
    creditScoreRange: body.creditScoreRange || "fair",
    cosigner: body.cosigner === true || body.cosigner === "true",
    eligibleForSubsidized: body.eligibleForSubsidized !== false && body.eligibleForSubsidized !== "false", // Default true
    eligibleForFELS: body.eligibleForFELS === true || body.eligibleForFELS === "true", // Default false (requires specific programs)
    parentPlusAvailable: body.parentPlusAvailable === true || body.parentPlusAvailable === "true",
    riskPreference: body.riskPreference || "balanced",
    
    // Strict payoff constraints
    targetPayoffYears: body.targetPayoffYears ? Number(body.targetPayoffYears) : 10, // Default 10 years
    maxMonthlyPayment: body.maxMonthlyPayment ? Number(body.maxMonthlyPayment) : null, // Optional strict cap
    
    // In-school options
    inSchoolPayment: body.inSchoolPayment || "defer",
    // Handle tuition growth rate - allow 0, default to 7% only if not provided
    tuitionGrowthRate: (body.tuitionGrowthRate === undefined || body.tuitionGrowthRate === null || body.tuitionGrowthRate === "") 
      ? 0.07 
      : Number(body.tuitionGrowthRate)
  };
}

app.listen(port, () => {
  console.log(`Loan optimizer API running on http://localhost:${port}`);
});
