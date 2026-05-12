import React, { useState, useEffect } from 'react';
import { Activity, LineChart } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { useStore } from '../store';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function BMITracker() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const { user, updateBMI } = useStore();
  const [bmiHistory, setBmiHistory] = useState<any[]>([]);

  useEffect(() => {
    if (user?.bmiHistory) {
      setBmiHistory(user.bmiHistory);
    }
  }, [user?.bmiHistory]);

  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    
    if (weightNum && heightNum) {
      const bmi = weightNum / (heightNum * heightNum);
      setBmiResult(bmi);
      setBmiCategory(getBMICategory(bmi));
      
      const bmiData = {
        weight: weightNum,
        height: heightNum,
        date: new Date().toISOString(),
        bmi,
      };
      
      updateBMI(bmiData);
      setBmiHistory(prev => [...prev, bmiData]);
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const chartData = {
    labels: bmiHistory.map(h => new Date(h.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'BMI History',
        data: bmiHistory.map(h => h.bmi) || [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold">BMI Health Tracker</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your weight in kilograms"
            step="0.1"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Height (m)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your height in meters"
            step="0.01"
            min="0"
          />
        </div>
      </div>

      <button
        onClick={calculateBMI}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Calculate BMI
      </button>

      {bmiResult !== null && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold">Your BMI: {bmiResult.toFixed(2)}</h3>
          <p className="text-gray-600">
            Category: {bmiCategory}
          </p>
        </div>
      )}

      {bmiHistory.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">BMI History</h3>
          <div className="h-64">
            <Line data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      )}
    </div>
  );
}