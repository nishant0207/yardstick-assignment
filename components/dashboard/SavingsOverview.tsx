"use client";

import { useState } from "react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { Switch } from "@/components/ui/switch";

interface MonthlyExpense {
    _id: string;
    total: number;
}

interface MonthlyBudgeted {
    _id: string;
    totalBudgeted: number;
}

interface Props {
    monthlyExpenses: MonthlyExpense[];
    monthlyBudgeted: MonthlyBudgeted[];
}

const inrFormat = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});

const formatINR = (value: number) => {
    const abs = Math.abs(value);
    const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(abs);
    return value < 0 ? `- ${formatted}` : formatted;
};

export default function SavingsOverview({
    monthlyExpenses,
    monthlyBudgeted,
}: Props) {
    const [showYearly, setShowYearly] = useState(false);
    const [isBarChart, setIsBarChart] = useState(false);

    const monthlySavings = monthlyExpenses.map((exp) => {
        const match = monthlyBudgeted.find((b) => b._id === exp._id);
        const budgeted = match ? match.totalBudgeted : 0;
        const saving = budgeted - exp.total;
        return { month: exp._id, saving };
    });

    const yearlySavings = [
        {
            year: "2025",
            saving: monthlySavings.reduce((sum, m) => sum + m.saving, 0),
        },
    ];

    const chartData = showYearly ? yearlySavings : monthlySavings;
    const xKey = showYearly ? "year" : "month";

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-xl font-bold">Savings Overview</h2>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-300">Monthly</span>
                        <Switch checked={showYearly} onCheckedChange={setShowYearly} />
                        <span className="text-sm text-gray-500 dark:text-gray-300">Yearly</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-300">Line</span>
                        <Switch checked={isBarChart} onCheckedChange={setIsBarChart} />
                        <span className="text-sm text-gray-500 dark:text-gray-300">Bar</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                {isBarChart ? (
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={xKey} />
                        <YAxis
                            tickFormatter={formatINR}
                            width={80}
                            domain={["auto", "auto"]}
                            tick={{ fill: "#4B5563", fontSize: 12 }} // Tailwind's text-gray-600
                        />
                        <Tooltip
                            formatter={(value: number) => inrFormat.format(value)}
                            labelFormatter={(label) =>
                                showYearly ? `${label}` : `Month: ${label}`
                            }
                        />
                        <Bar dataKey="saving">
                            {
                                chartData.map((entry: { saving: number }, index: number) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.saving < 0 ? "#EF4444" : "#10B981"}
                                    />
                                ))
                            }
                        </Bar>
                    </BarChart>
                ) : (
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={xKey} />
                        <YAxis
                            tickFormatter={formatINR}
                            width={80}
                            domain={["auto", "auto"]}
                            tick={{ fill: "#4B5563", fontSize: 12 }} // Tailwind's text-gray-600
                        />
                        <Tooltip
                            formatter={(value: number) => inrFormat.format(value)}
                            labelFormatter={(label) =>
                                showYearly ? `${label}` : `Month: ${label}`
                            }
                        />
                        <Line
                            type="monotone"
                            dataKey="saving"
                            stroke="#10B981"
                            strokeWidth={3}
                            dot={{ r: 3 }}
                        />
                    </LineChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}