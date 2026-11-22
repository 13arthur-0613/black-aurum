const chartElement = document.getElementById("chart");

const chart = LightweightCharts.createChart(chartElement, {
  width: chartElement.clientWidth,
  height: 420,
  layout: {
    background: { color: "#111217" },
    textColor: "#999999"
  },
  grid: {
    vertLines: { color: "#202127" },
    horzLines: { color: "#202127" }
  },
  rightPriceScale: {
    borderColor: "#34343a"
  },
  timeScale: {
    borderColor: "#34343a",
    timeVisible: true
  },
  crosshair: {
    mode: LightweightCharts.CrosshairMode.Normal
  }
});

const assets = {
  stocks: {
    AAPL: { name: "Apple", price: 230 },
    NVDA: { name: "NVIDIA", price: 145 },
    MSFT: { name: "Microsoft", price: 420 }
  },
  crypto: {
    BTC: { name: "Bitcoin", price: 95000 },
    ETH: { name: "Ethereum", price: 3200 }
  },
  forex: {
    EURUSD: { name: "EUR / USD", price: 1.08 },
    GBPUSD: { name: "GBP / USD", price: 1.27 }
  }
};

let market = "stocks";
let asset = "AAPL";
let interval = "1h";
let chartType = "candle";
let activeSeries = null;

const steps = {
  "1m": 60,
  "5m": 300,
  "15m": 900,
  "30m": 1800,
  "1h": 3600,
  "4h": 14400,
  "1d": 86400
};

function generateData() {
  const base = assets[market][asset].price;
  const step = steps[interval];
  const now = Math.floor(Date.now() / 1000);
  const start = Math.floor(now / step) * step - 99 * step;
  let previous = base;
  const candles = [];

  for (let i = 0; i < 100; i++) {
    const open = previous;
    const change = (Math.random() - 0.49) * base * 0.012;
    const close = Math.max(base * 0.1, open + change);
    const high = Math.max(open, close) + Math.random() * base * 0.004;
    const low = Math.min(open, close) - Math.random() * base * 0.004;

    candles.push({
      time: start + i * step,
      open,
      high,
      low,
      close
    });

    previous = close;
  }

  return candles;
}

function renderChart() {
  if (activeSeries) {
    chart.removeSeries(activeSeries);
  }

  const data = generateData();
  const decimals = market === "forex" ? 5 : 2;

  if (chartType === "candle") {
    activeSeries = chart.addCandlestickSeries({
      upColor: "#16a36a",
      downColor: "#e04b55",
      borderUpColor: "#16a36a",
      borderDownColor: "#e04b55",
      wickUpColor: "#16a36a",
      wickDownColor: "#e04b55",
      priceFormat: {
        type: "price",
        precision: decimals,
        minMove: Math.pow(10, -decimals)
      }
    });

    activeSeries.setData(data);
  } else {
    activeSeries = chart.addLineSeries({
      color: "#D6B56D",
      lineWidth: 2,
      priceFormat: {
        type: "price",
        precision: decimals,
        minMove: Math.pow(10, -decimals)
      }
    });

    activeSeries.setData(
      data.map(item => ({
        time: item.time,
        value: item.close
      }))
    );
  }

  chart.timeScale().fitContent();

  const last = data[data.length - 1].close;
  document.getElementById("price").textContent =
    last.toFixed(decimals) + " (SIMULATED)";

  document.getElementById("assetName").textContent =
    assets[market][asset].name + " · " + asset;
}

function updateAssets() {
  const selector = document.getElementById("asset");
  selector.innerHTML = "";

  Object.keys(assets[market]).forEach(symbol => {
    const option = document.createElement("option");
    option.value = symbol;
    option.textContent =
      assets[market][symbol].name + " · " + symbol;
    selector.appendChild(option);
  });

  asset = Object.keys(assets[market])[0];
  selector.value = asset;
  renderChart();
}

document.getElementById("marketType").addEventListener("change", event => {
  market = event.target.value;
  updateAssets();
});

document.getElementById("asset").addEventListener("change", event => {
  asset = event.target.value;
  renderChart();
});

document.querySelectorAll(".type-btn").forEach(button => {
  button.addEventListener("click", () => {
    chartType = button.dataset.type;

    document.querySelectorAll(".type-btn").forEach(item =>
      item.classList.remove("active")
    );

    button.classList.add("active");
    renderChart();
  });
});

document.querySelectorAll(".intervals button").forEach(button => {
  button.addEventListener("click", () => {
    interval = button.dataset.interval;

    document.querySelectorAll(".intervals button").forEach(item =>
      item.classList.remove("active")
    );

    button.classList.add("active");
    renderChart();
  });
});

window.addEventListener("resize", () => {
  chart.applyOptions({
    width: chartElement.clientWidth
  });
});

renderChart();
