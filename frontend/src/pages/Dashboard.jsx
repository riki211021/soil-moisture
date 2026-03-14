import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip, Filler } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip, Filler);

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [latest, setLatest] = useState(null);

  const [pump1Mode, setPump1Mode] = useState("auto");
  const [pump2Mode, setPump2Mode] = useState("auto");

  const [pump1Status, setPump1Status] = useState(0);
  const [pump2Status, setPump2Status] = useState(0);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/moisture");

      setHistory(res.data);
      setLatest(res.data[res.data.length - 1]);

      const pump = await axios.get("http://127.0.0.1:8000/api/pump/status");

      setPump1Mode(pump.data.pump1_mode);
      setPump2Mode(pump.data.pump2_mode);

      setPump1Status(pump.data.pump1_status);
      setPump2Status(pump.data.pump2_status);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSensorColor = (status) => {
    if (status === "KERING") return "from-red-800 to-red-600";
    if (status === "LEMBAB") return "from-orange-700 to-yellow-600";
    if (status === "BASAH") return "from-green-800 to-green-600";
    return "from-gray-600 to-gray-400";
  };

  const chartData = {
    labels: history.map((i, index) => {
      const date = new Date(i.created_at);

      const time = date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const day = date.toLocaleDateString("id-ID");

      if (index === 0) {
        return `${day} ${time}`;
      }

      return time;
    }),

    datasets: [
      {
        label: "Sensor 1",
        data: history.map((i) => i.moisture_1),
        borderColor: "#166534",
        backgroundColor: "rgba(22,101,52,0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Sensor 2",
        data: history.map((i) => i.moisture_2),
        borderColor: "#c9a84c",
        backgroundColor: "rgba(201,168,76,0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const controlPump = async (pump, value) => {
    let data = {};

    if (pump === 1) data.pump1_status = value;
    if (pump === 2) data.pump2_status = value;

    await axios.post("http://127.0.0.1:8000/api/pump/control", data);
  };

  const changeMode = async (pump, mode) => {
    let data = {};

    if (pump === 1) {
      data.pump1_mode = mode;
      setPump1Mode(mode);
    }

    if (pump === 2) {
      data.pump2_mode = mode;
      setPump2Mode(mode);
    }

    await axios.post("http://127.0.0.1:8000/api/pump/control", data);
  };

  const PumpCard = ({ id, mode, status }) => (
    <div className="bg-white rounded-xl shadow border border-green-100 p-6">

      <div className="flex justify-between mb-4">
        <h3 className="font-semibold text-lg text-green-900">
          Pompa {id}
        </h3>

        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold
          ${mode === "auto" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
        `}
        >
          {mode}
        </span>
      </div>

      {/* STATUS POMPA */}
      <div className="flex items-center gap-2 mb-4">

        <span
          className={`w-3 h-3 rounded-full
          ${status === 1 ? "bg-green-500 animate-pulse" : "bg-red-500"}
        `}
        ></span>

        <span className="text-sm font-medium">
          {status === 1 ? "Pompa Menyala" : "Pompa Mati"}
        </span>

      </div>

      {/* MODE BUTTON */}
      <div className="flex gap-2 mb-4">

        <button
          onClick={() => changeMode(id, "auto")}
          className={`flex-1 py-2 rounded-full text-sm
          ${mode === "auto" ? "bg-white shadow text-green-800" : "bg-green-50 text-green-600"}
        `}
        >
          Auto
        </button>

        <button
          onClick={() => changeMode(id, "manual")}
          className={`flex-1 py-2 rounded-full text-sm
          ${mode === "manual" ? "bg-white shadow text-green-800" : "bg-green-50 text-green-600"}
        `}
        >
          Manual
        </button>

      </div>

      {/* CONTROL BUTTON */}
      <div className="flex gap-2">

        <button
          disabled={mode === "auto"}
          onClick={() => controlPump(id, 1)}
          className="flex-1 bg-green-700 hover:bg-green-600 text-white py-2 rounded-lg disabled:opacity-40"
        >
          Nyalakan
        </button>

        <button
          disabled={mode === "auto"}
          onClick={() => controlPump(id, 0)}
          className="flex-1 border border-green-200 py-2 rounded-lg hover:bg-green-50 disabled:opacity-40"
        >
          Matikan
        </button>

      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex flex-col p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6 border-b pb-4">

        <div className="flex items-center gap-2">

          <img src="/sisiram.png" alt="Logo SiSiram" className="w-20 h-20" />

          <h1 className="text-4xl font-light text-green-900">
            Sistem <span className="font-semibold text-green-600">Siram Otomatis</span>
          </h1>

        </div>

        <div className="flex items-center gap-2 bg-green-900 text-white px-4 py-2 rounded-full text-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Live
        </div>

      </div>

      {/* BODY */}

      <div className="flex-1 grid lg:grid-cols-[340px,1fr] gap-8 overflow-hidden">

        {/* LEFT PANEL */}

        <div className="flex flex-col gap-6 overflow-y-auto">

          {latest && (
            <>
              <h2 className="text-xl font-semibold text-green-900">
                Kelembaban Tanah
              </h2>

              <div className="grid grid-cols-2 gap-4">

                <div className={`bg-gradient-to-br ${getSensorColor(latest.status_1)} text-white p-6 rounded-xl shadow`}>

                  <p className="text-xs uppercase opacity-70">
                    Sensor 1
                  </p>

                  <p className="text-4xl font-bold mt-1">
                    {latest.moisture_1}%
                  </p>

                  <p className="text-sm mt-2">
                    {latest.status_1}
                  </p>

                </div>

                <div className={`bg-gradient-to-br ${getSensorColor(latest.status_2)} text-white p-6 rounded-xl shadow`}>

                  <p className="text-xs uppercase opacity-70">
                    Sensor 2
                  </p>

                  <p className="text-4xl font-bold mt-1">
                    {latest.moisture_2}%
                  </p>

                  <p className="text-sm mt-2">
                    {latest.status_2}
                  </p>

                </div>

              </div>
            </>
          )}

          <h2 className="text-xl font-semibold text-green-900">
            Kontrol Pompa
          </h2>

          <div className="flex flex-col gap-4">

            <PumpCard
              id={1}
              mode={pump1Mode}
              status={pump1Status}
            />

            <PumpCard
              id={2}
              mode={pump2Mode}
              status={pump2Status}
            />

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="flex flex-col">

          <h2 className="text-xl font-semibold text-green-900 mb-4">
            Riwayat Kelembaban
          </h2>

          <div className="flex-1 bg-white p-6 rounded-xl shadow border border-green-100">

            <Line
              data={chartData}
              options={chartOptions}
            />

          </div>

        </div>

      </div>

      {/* FOOTER */}

      <div className="text-center text-sm text-gray-500 mt-4">
        © {new Date().getFullYear()} Dashboard Sistem Siram Otomatis
      </div>

    </div>
  );
}