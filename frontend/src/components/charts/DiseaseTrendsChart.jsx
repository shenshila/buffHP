// src/components/charts/DiseaseTrendsChart.js
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const DiseaseTrendsChart = ({ data }) => {
    // Группируем данные по диагнозам, чтобы каждая линия представляла отдельный диагноз
    const groupedData = data.reduce((acc, item) => {
        const date = item.date.substring(0, 7); // Формат "YYYY-MM" для месяца
        if (!acc[date]) {
            acc[date] = { date: date };
        }
        acc[date][item.diagnosis] = item.count;
        return acc;
    }, {});

    const chartData = Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date));

    // Извлекаем все уникальные диагнозы для легенды
    const diagnoses = [...new Set(data.map((item) => item.diagnosis))];

    // Цвета для линий
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#f58021', '#00C49F', '#FFBB28', '#FF8042', '#A4DDED', '#C2B280', '#D5A6ED'];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
                data={chartData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend
                    verticalAlign="top"
                    align="center"
                    wrapperStyle={{ paddingTop: '10px', paddingBottom: '10px' }} // Добавляем отступы
                />
                {diagnoses.map((diagnosis, index) => (
                    <Line
                        key={diagnosis}
                        type="monotone"
                        dataKey={diagnosis}
                        stroke={colors[index % colors.length]}
                        activeDot={{ r: 8 }}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default DiseaseTrendsChart;