/**
 * Realistic subset of JoSAA and CSAB Cutoffs (Opening and Closing Ranks).
 * This provides the "dataset" for the Rank-vs-Reality counseling engine.
 * Real production apps would fetch tens of thousands of rows from a DB.
 * For this presentation, we bundle a rich, accurate static dataset covering top institutions.
 */

export const cutoffDataset = [
    // IITs
    {
        target: "IIT Bombay",
        tier: "IIT",
        branches: [
            { name: "Computer Science Engineering", or: 1, cr: 67 },
            { name: "Electrical Engineering", or: 95, cr: 481 },
            { name: "Mechanical Engineering", or: 560, cr: 1210 },
            { name: "Civil Engineering", or: 1800, cr: 3450 },
            { name: "Metallurgical Engineering", or: 3500, cr: 4850 },
        ],
        placement: { median: 22.5, highest: 150, percent: 95 },
        location: { city: "Mumbai", state: "MH", region: "West" },
        fees: 1150000, // 4 years
    },
    {
        target: "IIT Delhi",
        tier: "IIT",
        branches: [
            { name: "Computer Science Engineering", or: 25, cr: 118 },
            { name: "Mathematics & Computing", or: 120, cr: 350 },
            { name: "Electrical Engineering", or: 250, cr: 580 },
            { name: "Mechanical Engineering", or: 850, cr: 1800 },
            { name: "Civil Engineering", or: 2000, cr: 4200 },
        ],
        placement: { median: 21.0, highest: 120, percent: 94 },
        location: { city: "New Delhi", state: "DL", region: "North" },
        fees: 1100000,
    },
    {
        target: "IIT Kanpur",
        tier: "IIT",
        branches: [
            { name: "Computer Science Engineering", or: 110, cr: 238 },
            { name: "Mathematics & Scientific Computing", or: 350, cr: 980 },
            { name: "Electrical Engineering", or: 580, cr: 1350 },
            { name: "Mechanical Engineering", or: 1200, cr: 2900 },
        ],
        placement: { median: 20.0, highest: 110, percent: 92 },
        location: { city: "Kanpur", state: "UP", region: "North" },
        fees: 1050000,
    },
    {
        target: "IIT Kharagpur",
        tier: "IIT",
        branches: [
            { name: "Computer Science Engineering", or: 180, cr: 279 },
            { name: "Electronics & Electrical Comm.", or: 450, cr: 1100 },
            { name: "Mechanical Engineering", or: 1500, cr: 3200 },
            { name: "Civil Engineering", or: 3000, cr: 5800 },
        ],
        placement: { median: 19.5, highest: 100, percent: 91 },
        location: { city: "Kharagpur", state: "WB", region: "East" },
        fees: 1000000,
    },

    // Top NITs
    {
        target: "NIT Trichy",
        tier: "NIT",
        branches: [
            { name: "Computer Science Engineering", or: 250, cr: 1147 },
            { name: "Electronics & Communication", or: 1300, cr: 3200 },
            { name: "Electrical & Electronics", or: 3000, cr: 6500 },
            { name: "Mechanical Engineering", or: 5000, cr: 10500 },
            { name: "Civil Engineering", or: 12000, cr: 21000 },
            { name: "Metallurgical Engineering", or: 15000, cr: 26000 },
        ],
        placement: { median: 15.0, highest: 85, percent: 90 },
        location: { city: "Trichy", state: "TN", region: "South" },
        fees: 650000,
    },
    {
        target: "NIT Surathkal",
        tier: "NIT",
        branches: [
            { name: "Computer Science Engineering", or: 500, cr: 1600 },
            { name: "Information Technology", or: 1500, cr: 2800 },
            { name: "Electronics & Communication", or: 2500, cr: 4800 },
            { name: "Mechanical Engineering", or: 6000, cr: 12000 },
            { name: "Civil Engineering", or: 14000, cr: 24000 },
        ],
        placement: { median: 14.5, highest: 78, percent: 89 },
        location: { city: "Mangalore", state: "KA", region: "South" },
        fees: 650000,
    },
    {
        target: "NIT Warangal",
        tier: "NIT",
        branches: [
            { name: "Computer Science Engineering", or: 800, cr: 2100 },
            { name: "Electronics & Communication", or: 2800, cr: 5500 },
            { name: "Electrical & Electronics", or: 5000, cr: 9500 },
            { name: "Mechanical Engineering", or: 8000, cr: 14500 },
            { name: "Civil Engineering", or: 16000, cr: 27000 },
        ],
        placement: { median: 14.0, highest: 80, percent: 88 },
        location: { city: "Warangal", state: "TS", region: "South" },
        fees: 650000,
    },
    {
        target: "MNNIT Allahabad",
        tier: "NIT",
        branches: [
            { name: "Computer Science Engineering", or: 1200, cr: 4200 },
            { name: "Information Technology", or: 3500, cr: 5800 },
            { name: "Electronics & Communication", or: 5000, cr: 8500 },
            { name: "Mechanical Engineering", or: 10000, cr: 18000 },
            { name: "Civil Engineering", or: 18000, cr: 32000 },
        ],
        placement: { median: 13.5, highest: 65, percent: 85 },
        location: { city: "Prayagraj", state: "UP", region: "North" },
        fees: 600000,
    },

    // IIITs
    {
        target: "IIIT Hyderabad",
        tier: "IIIT",
        branches: [
            { name: "Computer Science Engineering", or: 150, cr: 850 },
            { name: "Electronics & Communication", or: 900, cr: 2400 },
        ],
        placement: { median: 25.0, highest: 130, percent: 99 },
        location: { city: "Hyderabad", state: "TS", region: "South" },
        fees: 1400000,
    },
    {
        target: "IIIT Allahabad",
        tier: "IIIT",
        branches: [
            { name: "Information Technology", or: 2500, cr: 5500 },
            { name: "Electronics & Communication", or: 6000, cr: 9500 },
        ],
        placement: { median: 18.0, highest: 82, percent: 95 },
        location: { city: "Prayagraj", state: "UP", region: "North" },
        fees: 650000,
    },
    {
        target: "IIIT Bangalore",
        tier: "IIIT",
        branches: [
            { name: "iMTech CSE", or: 1000, cr: 4500 },
            { name: "iMTech ECE", or: 4000, cr: 8500 },
        ],
        placement: { median: 22.0, highest: 110, percent: 96 },
        location: { city: "Bangalore", state: "KA", region: "South" },
        fees: 1800000,
    },

    // Mid-Tier NITs / GFTIs / Private (for range)
    {
        target: "NIT Kurukshetra",
        tier: "NIT",
        branches: [
            { name: "Computer Science Engineering", or: 3000, cr: 7500 },
            { name: "Information Technology", or: 6000, cr: 10500 },
            { name: "Mechanical Engineering", or: 15000, cr: 25000 },
            { name: "Civil Engineering", or: 25000, cr: 42000 },
            { name: "Production & Industrial", or: 30000, cr: 52000 },
        ],
        placement: { median: 11.0, highest: 55, percent: 80 },
        location: { city: "Kurukshetra", state: "HR", region: "North" },
        fees: 600000,
    },
    {
        target: "NIT Silchar",
        tier: "NIT",
        branches: [
            { name: "Computer Science Engineering", or: 8000, cr: 13500 },
            { name: "Electronics & Communication", or: 14000, cr: 22000 },
            { name: "Electrical Engineering", or: 22000, cr: 35000 },
            { name: "Mechanical Engineering", or: 32000, cr: 45000 },
            { name: "Civil Engineering", or: 42000, cr: 65000 },
        ],
        placement: { median: 10.5, highest: 45, percent: 78 },
        location: { city: "Silchar", state: "AS", region: "NorthEast" },
        fees: 600000,
    },
    {
        target: "BIT Mesra",
        tier: "GFTI",
        branches: [
            { name: "Computer Science Engineering", or: 8500, cr: 16000 },
            { name: "Artificial Intelligence", or: 12000, cr: 19500 },
            { name: "Electronics & Communication", or: 20000, cr: 32000 },
            { name: "Mechanical Engineering", or: 35000, cr: 55000 },
        ],
        placement: { median: 11.5, highest: 51, percent: 75 },
        location: { city: "Ranchi", state: "JH", region: "East" },
        fees: 1500000,
    },
    {
        target: "PEC Chandigarh",
        tier: "GFTI",
        branches: [
            { name: "Computer Science Engineering", or: 4500, cr: 10500 },
            { name: "Electronics & Communication", or: 12000, cr: 18500 },
            { name: "Mechanical Engineering", or: 25000, cr: 38000 },
            { name: "Civil Engineering", or: 38000, cr: 58000 },
        ],
        placement: { median: 12.0, highest: 65, percent: 82 },
        location: { city: "Chandigarh", state: "CH", region: "North" },
        fees: 700000,
    },
    {
        target: "RVCE Bangalore",
        tier: "Private",
        branches: [
            { name: "Computer Science Engineering", or: 1500, cr: 7500 }, // Based on assumed equivalent all india rank
            { name: "Information Science", or: 6000, cr: 12000 },
            { name: "Electronics & Communication", or: 12000, cr: 25000 },
        ],
        placement: { median: 10.0, highest: 55, percent: 90 },
        location: { city: "Bangalore", state: "KA", region: "South" },
        fees: 1600000,
    },
    {
        target: "Thapar University",
        tier: "Private",
        branches: [
            { name: "Computer Engineering", or: 15000, cr: 45000 },
            { name: "Electronics & Communication", or: 40000, cr: 75000 },
            { name: "Mechanical Engineering", or: 70000, cr: 120000 },
        ],
        placement: { median: 9.5, highest: 45, percent: 85 },
        location: { city: "Patiala", state: "PB", region: "North" },
        fees: 2200000,
    },
    {
        target: "VIT Vellore",
        tier: "Private",
        branches: [
            { name: "Computer Science (Cat 1)", or: 10000, cr: 35000 },
            { name: "Computer Science (Cat 3)", or: 30000, cr: 85000 },
            { name: "Electronics & Communication", or: 50000, cr: 110000 },
        ],
        placement: { median: 8.5, highest: 42, percent: 88 },
        location: { city: "Vellore", state: "TN", region: "South" },
        fees: 1800000,
    },
    {
        target: "SRM Kattankulathur",
        tier: "Private",
        branches: [
            { name: "Computer Science Engineering", or: 25000, cr: 95000 },
            { name: "Electronics & Communication", or: 80000, cr: 150000 },
            { name: "Mechanical Engineering", or: 120000, cr: 250000 },
        ],
        placement: { median: 6.5, highest: 35, percent: 80 },
        location: { city: "Chennai", state: "TN", region: "South" },
        fees: 1600000,
    },
];

export function getRankOptions(rank, examType) {
    // Very simplistic probability calculator purely based on rank
    const results = [];

    cutoffDataset.forEach(college => {
        // Basic filter: only IITs for Advanced, others for Main. (Simplified here for demo)
        if (examType === "JEE Advanced" && college.tier !== "IIT") return;
        if (examType === "JEE Main" && college.tier === "IIT") return;

        const matchedBranches = [];

        college.branches.forEach(branch => {
            // Calculate probability
            let probability = 0;
            let label = "Out of Reach";

            if (rank <= branch.or) {
                probability = 99;
                label = "Guaranteed";
            } else if (rank <= branch.cr * 0.8) {
                probability = 90;
                label = "Safe";
            } else if (rank <= branch.cr) {
                probability = 70;
                label = "Realistic";
            } else if (rank <= branch.cr * 1.2) {
                probability = 30;
                label = "Reach / Dream";
            } else if (rank <= branch.cr * 1.5) {
                probability = 10;
                label = "Highly Unlikely";
            }

            if (probability > 5) {
                matchedBranches.push({
                    ...branch,
                    probability,
                    label
                });
            }
        });

        if (matchedBranches.length > 0) {
            results.push({
                ...college,
                matchedBranches: matchedBranches.sort((a, b) => b.probability - a.probability)
            });
        }
    });

    return results.sort((a, b) => {
        // Sort primarily by highest probability branch, then by median placement
        const maxProbA = Math.max(...a.matchedBranches.map(b => b.probability));
        const maxProbB = Math.max(...b.matchedBranches.map(b => b.probability));

        if (maxProbA !== maxProbB) {
            return maxProbB - maxProbA;
        }
        return b.placement.median - a.placement.median;
    });
}
