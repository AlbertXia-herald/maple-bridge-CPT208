const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const seniorModeToggle = document.querySelector("[data-senior-mode-toggle]");
const languageToggle = document.querySelector("[data-language-toggle]");
const SENIOR_MODE_STORAGE_KEY = "mapleBridgeSeniorMode";

const readSeniorModePreference = () => {
  try {
    return window.localStorage.getItem(SENIOR_MODE_STORAGE_KEY) === "true";
  } catch (error) {
    return false;
  }
};

const writeSeniorModePreference = (enabled) => {
  try {
    window.localStorage.setItem(SENIOR_MODE_STORAGE_KEY, String(enabled));
  } catch (error) {
    // Ignore storage failures and keep the current page state usable.
  }
};

const syncSeniorModeUi = (enabled) => {
  document.documentElement.classList.toggle("is-senior-mode", enabled);
  document.body.classList.toggle("is-senior-mode", enabled);

  if (!seniorModeToggle) {
    return;
  }

  seniorModeToggle.setAttribute("aria-pressed", String(enabled));
  seniorModeToggle.setAttribute("aria-label", enabled ? "退出长辈模式" : "开启长辈模式");
  seniorModeToggle.title = enabled ? "点击退出长辈模式" : "点击开启长辈模式";
};

syncSeniorModeUi(readSeniorModePreference());

if (seniorModeToggle) {
  seniorModeToggle.addEventListener("click", () => {
    const nextEnabled = !document.body.classList.contains("is-senior-mode");
    syncSeniorModeUi(nextEnabled);
    writeSeniorModePreference(nextEnabled);
  });
}

if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    languageToggle.setAttribute("aria-label", "中英文切换功能暂未启用");
  });
}

if (menuToggle && siteNav) {
  const closeMenu = () => {
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 760) {
      closeMenu();
    }
  });
}

const weatherTicker = document.querySelector("[data-weather-ticker]");

if (weatherTicker) {
  const slides = Array.from(weatherTicker.querySelectorAll(".weather-slide"));
  let activeIndex = 0;
  const weatherDate = document.querySelector("[data-weather-date]");
  const weatherIcon = document.querySelector("[data-weather-icon]");
  const weatherTemp = document.querySelector("[data-weather-temp]");
  const weatherSummary = document.querySelector("[data-weather-summary]");
  const weatherHigh = document.querySelector("[data-weather-high]");
  const weatherLow = document.querySelector("[data-weather-low]");
  const weatherAqiBadge = document.querySelector("[data-weather-aqi-badge]");
  const weatherAqiLevel = document.querySelector("[data-weather-aqi-level]");
  const weatherAqiSummary = document.querySelector("[data-weather-aqi-summary]");
  const weatherPm25 = document.querySelector("[data-weather-pm25]");
  const weatherAqiTip = document.querySelector("[data-weather-aqi-tip]");
  const weatherHumidityBadge = document.querySelector("[data-weather-humidity-badge]");
  const weatherWind = document.querySelector("[data-weather-wind]");
  const weatherComfortSummary = document.querySelector("[data-weather-comfort-summary]");
  const weatherUpdate = document.querySelector("[data-weather-update]");
  const weatherLocation = document.querySelector("[data-weather-location]");
  const forecastChart = document.querySelector("[data-forecast-chart]");
  const forecastUpdate = document.querySelector("[data-forecast-update]");
  const WEATHER_LOCATION = {
    label: "苏州·枫桥景区",
    latitude: 31.3141,
    longitude: 120.5553,
    timezone: "Asia/Shanghai",
  };
  const weatherCodeMap = {
    0: { icon: "☀", label: "晴朗" },
    1: { icon: "🌤", label: "大致晴朗" },
    2: { icon: "⛅", label: "局部多云" },
    3: { icon: "☁", label: "阴天" },
    45: { icon: "🌫", label: "有雾" },
    48: { icon: "🌫", label: "雾凇" },
    51: { icon: "🌦", label: "小毛雨" },
    53: { icon: "🌦", label: "毛雨" },
    55: { icon: "🌧", label: "强毛雨" },
    56: { icon: "🌧", label: "冻毛雨" },
    57: { icon: "🌧", label: "强冻毛雨" },
    61: { icon: "🌦", label: "小雨" },
    63: { icon: "🌧", label: "中雨" },
    65: { icon: "🌧", label: "大雨" },
    66: { icon: "🌧", label: "冻雨" },
    67: { icon: "🌧", label: "强冻雨" },
    71: { icon: "🌨", label: "小雪" },
    73: { icon: "🌨", label: "中雪" },
    75: { icon: "❄", label: "大雪" },
    77: { icon: "❄", label: "阵雪" },
    80: { icon: "🌦", label: "阵雨" },
    81: { icon: "🌧", label: "较强阵雨" },
    82: { icon: "⛈", label: "强阵雨" },
    85: { icon: "🌨", label: "阵雪" },
    86: { icon: "🌨", label: "强阵雪" },
    95: { icon: "⛈", label: "雷暴" },
    96: { icon: "⛈", label: "雷暴夹冰雹" },
    99: { icon: "⛈", label: "强雷暴夹冰雹" },
  };

  const showSlide = (index) => {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === index);
    });
  };

  const formatDate = (isoString) => {
    const date = isoString ? new Date(isoString) : new Date();

    return `${String(date.getMonth() + 1).padStart(2, "0")} / ${String(date.getDate()).padStart(2, "0")}`;
  };

  const formatTime = (isoString) => {
    const date = isoString ? new Date(isoString) : new Date();

    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const formatForecastDay = (isoString) => {
    const date = new Date(isoString);
    const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

    return weekDays[date.getDay()];
  };

  const buildForecastSeries = (dailyWeather) =>
    dailyWeather.time.map((time, index) => ({
      time,
      label: formatForecastDay(time),
      icon: (weatherCodeMap[dailyWeather.weather_code[index]] || { icon: "⛅" }).icon,
      max: Math.round(dailyWeather.temperature_2m_max[index]),
      min: Math.round(dailyWeather.temperature_2m_min[index]),
    }));

  const createForecastSvg = (series) => {
      const width = 640;
      const height = 198;
      const padding = { top: 38, right: 22, bottom: 30, left: 22 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;
    const allTemps = series.flatMap((item) => [item.max, item.min]);
    const minTemp = Math.min(...allTemps) - 2;
    const maxTemp = Math.max(...allTemps) + 2;
    const tempRange = Math.max(maxTemp - minTemp, 1);
    const getX = (index) => padding.left + (chartWidth / Math.max(series.length - 1, 1)) * index;
    const getY = (value) => padding.top + ((maxTemp - value) / tempRange) * chartHeight;
    const highPoints = series.map((item, index) => `${getX(index)},${getY(item.max)}`).join(" ");
    const lowPoints = series.map((item, index) => `${getX(index)},${getY(item.min)}`).join(" ");
    const gridLines = [0, 0.5, 1]
      .map((ratio) => {
        const y = padding.top + chartHeight * ratio;
        return `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="rgba(111, 99, 88, 0.12)" stroke-width="1" />`;
      })
      .join("");
    const labels = series
      .map((item, index) => {
        const x = getX(index);
        const yHigh = getY(item.max);
        const yLow = getY(item.min);

        return `
          <text x="${x}" y="${padding.top - 18}" text-anchor="middle" font-size="18">${item.icon}</text>
          <text x="${x}" y="${yHigh - 10}" text-anchor="middle" font-size="11" fill="#8c4a37" font-weight="700">${item.max}°</text>
          <circle cx="${x}" cy="${yHigh}" r="4" fill="#9a4f3c" />
          <text x="${x}" y="${yLow + 18}" text-anchor="middle" font-size="11" fill="#5e7b87" font-weight="700">${item.min}°</text>
          <circle cx="${x}" cy="${yLow}" r="4" fill="#6f92a0" />
          <text x="${x}" y="${height - 16}" text-anchor="middle" font-size="11" fill="#6f6358">${item.label}</text>
        `;
      })
      .join("");

    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="未来七天最高温和最低温趋势图" preserveAspectRatio="none">
        ${gridLines}
        <polyline points="${highPoints}" fill="none" stroke="#9a4f3c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <polyline points="${lowPoints}" fill="none" stroke="#6f92a0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        ${labels}
      </svg>
    `;
  };

  const renderForecastChart = (dailyWeather) => {
    if (!forecastChart) {
      return;
    }

    if (
      !dailyWeather ||
      !Array.isArray(dailyWeather.time) ||
      !Array.isArray(dailyWeather.temperature_2m_max) ||
      !Array.isArray(dailyWeather.temperature_2m_min) ||
      !Array.isArray(dailyWeather.weather_code) ||
      dailyWeather.time.length < 2
    ) {
      forecastChart.textContent = "未来一周天气趋势暂不可用。";
      return;
    }

    const series = buildForecastSeries(dailyWeather);
    forecastChart.innerHTML = createForecastSvg(series);
  };

  const getAqiLevel = (aqi) => {
    if (aqi <= 50) {
      return {
        label: "空气优",
        summary: "空气状态较好，适合在枫桥慢行与拍照。",
        tip: "户外活动舒适",
        warn: false,
      };
    }

    if (aqi <= 100) {
      return {
        label: "空气良",
        summary: "整体适合游览，敏感人群可减少长时间停留在车流附近。",
        tip: "敏感人群留意防护",
        warn: false,
      };
    }

    if (aqi <= 150) {
      return {
        label: "轻度污染",
        summary: "建议控制长时间剧烈活动，停留较久时可佩戴口罩。",
        tip: "久留户外建议防护",
        warn: true,
      };
    }

    if (aqi <= 200) {
      return {
        label: "中度污染",
        summary: "适合短时浏览，老人和儿童建议减少高强度户外活动。",
        tip: "建议缩短停留时长",
        warn: true,
      };
    }

    return {
      label: "空气较差",
      summary: "建议以室内或短时活动为主，并做好基础防护。",
      tip: "外出请加强防护",
      warn: true,
    };
  };

  const getWeatherSummary = (label, temperature, maxTemp, minTemp) => {
    if (temperature >= 30) {
      return `${label}，体感偏热，建议避开午后高温时段。`;
    }

    if (temperature <= 8) {
      return `${label}，气温偏低，适合慢游但需注意保暖。`;
    }

    if (maxTemp - minTemp >= 8) {
      return `${label}，昼夜温差较明显，出行建议带一件薄外套。`;
    }

    return `${label}，体感较舒适，适合在枫桥轻量漫游。`;
  };

  const getComfortSummary = (humidity, windSpeed, weatherLabel) => {
    if (windSpeed >= 20) {
      return `${weatherLabel}伴随较明显风感，临水拍照时注意防风。`;
    }

    if (humidity >= 80) {
      return `空气湿润，${weatherLabel}下更适合慢节奏浏览与短暂停留。`;
    }

    return `${weatherLabel}下风感平稳，适合轻量步行、拍照与快速浏览。`;
  };

  const setWeatherErrorState = () => {
    if (weatherDate) {
      weatherDate.textContent = formatDate();
    }

    if (weatherIcon) {
      weatherIcon.textContent = "☁";
    }

    if (weatherTemp) {
      weatherTemp.textContent = "天气暂不可用";
    }

    if (weatherSummary) {
      weatherSummary.textContent = "实时天气数据获取失败，请稍后刷新再试。";
    }

    if (weatherHigh) {
      weatherHigh.textContent = "最高 --°C";
    }

    if (weatherLow) {
      weatherLow.textContent = "最低 --°C";
    }

    if (weatherAqiBadge) {
      weatherAqiBadge.textContent = "AQI --";
      weatherAqiBadge.classList.remove("weather-badge-warn");
    }

    if (weatherAqiLevel) {
      weatherAqiLevel.textContent = "空气数据暂不可用";
    }

    if (weatherAqiSummary) {
      weatherAqiSummary.textContent = "空气质量接口暂时未返回结果。";
    }

    if (weatherPm25) {
      weatherPm25.textContent = "PM2.5 --";
    }

    if (weatherAqiTip) {
      weatherAqiTip.textContent = "稍后可再次尝试";
    }

    if (weatherHumidityBadge) {
      weatherHumidityBadge.textContent = "湿度 --";
    }

    if (weatherWind) {
      weatherWind.textContent = "风速 --";
    }

    if (weatherComfortSummary) {
      weatherComfortSummary.textContent = "实时天气不可用时，建议以景区现场提示为准。";
    }

    if (weatherUpdate) {
      weatherUpdate.textContent = "实时接口暂不可用";
    }

    if (weatherLocation) {
      weatherLocation.textContent = WEATHER_LOCATION.label;
    }

    if (forecastChart) {
      forecastChart.textContent = "未来一周天气趋势暂不可用。";
    }

    if (forecastUpdate) {
      forecastUpdate.textContent = "暂无数据";
    }
  };

  const loadRealtimeWeather = async () => {
    try {
      const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
      weatherUrl.searchParams.set("latitude", String(WEATHER_LOCATION.latitude));
      weatherUrl.searchParams.set("longitude", String(WEATHER_LOCATION.longitude));
      weatherUrl.searchParams.set("current", "temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m");
      weatherUrl.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,weather_code");
      weatherUrl.searchParams.set("forecast_days", "7");
      weatherUrl.searchParams.set("timezone", WEATHER_LOCATION.timezone);

      const airUrl = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
      airUrl.searchParams.set("latitude", String(WEATHER_LOCATION.latitude));
      airUrl.searchParams.set("longitude", String(WEATHER_LOCATION.longitude));
      airUrl.searchParams.set("current", "us_aqi,pm2_5");
      airUrl.searchParams.set("timezone", WEATHER_LOCATION.timezone);

      const [weatherResponse, airResponse] = await Promise.all([
        fetch(weatherUrl.toString()),
        fetch(airUrl.toString()),
      ]);

      if (!weatherResponse.ok || !airResponse.ok) {
        throw new Error(`Weather API request failed: weather=${weatherResponse.status}, air=${airResponse.status}`);
      }

      const [weatherData, airData] = await Promise.all([
        weatherResponse.json(),
        airResponse.json(),
      ]);

      const currentWeather = weatherData.current;
      const dailyWeather = weatherData.daily;
      const currentAir = airData.current;

      if (!currentWeather || !dailyWeather || !currentAir) {
        throw new Error("Incomplete weather payload.");
      }

      const weatherInfo = weatherCodeMap[currentWeather.weather_code] || {
        icon: "⛅",
        label: "天气平稳",
      };
      const temperature = Math.round(currentWeather.temperature_2m);
      const maxTemp = Math.round(dailyWeather.temperature_2m_max[0]);
      const minTemp = Math.round(dailyWeather.temperature_2m_min[0]);
      const humidity = Math.round(currentWeather.relative_humidity_2m);
      const windSpeed = Math.round(currentWeather.wind_speed_10m);
      const aqi = Math.round(currentAir.us_aqi);
      const pm25 = Number(currentAir.pm2_5);
      const aqiLevel = getAqiLevel(aqi);

      if (weatherDate) {
        weatherDate.textContent = formatDate(currentWeather.time);
      }

      if (weatherIcon) {
        weatherIcon.textContent = weatherInfo.icon;
      }

      if (weatherTemp) {
        weatherTemp.textContent = `${temperature}°C`;
      }

      if (weatherSummary) {
        weatherSummary.textContent = getWeatherSummary(weatherInfo.label, temperature, maxTemp, minTemp);
      }

      if (weatherHigh) {
        weatherHigh.textContent = `最高 ${maxTemp}°C`;
      }

      if (weatherLow) {
        weatherLow.textContent = `最低 ${minTemp}°C`;
      }

      if (weatherAqiBadge) {
        weatherAqiBadge.textContent = `AQI ${aqi}`;
        weatherAqiBadge.classList.toggle("weather-badge-warn", aqiLevel.warn);
      }

      if (weatherAqiLevel) {
        weatherAqiLevel.textContent = aqiLevel.label;
      }

      if (weatherAqiSummary) {
        weatherAqiSummary.textContent = aqiLevel.summary;
      }

      if (weatherPm25) {
        weatherPm25.textContent = `PM2.5 ${Number.isFinite(pm25) ? `${Math.round(pm25)} ug/m3` : "--"}`;
      }

      if (weatherAqiTip) {
        weatherAqiTip.textContent = aqiLevel.tip;
      }

      if (weatherHumidityBadge) {
        weatherHumidityBadge.textContent = `湿度 ${humidity}%`;
      }

      if (weatherWind) {
        weatherWind.textContent = `风速 ${windSpeed} km/h`;
      }

      if (weatherComfortSummary) {
        weatherComfortSummary.textContent = getComfortSummary(humidity, windSpeed, weatherInfo.label);
      }

      if (weatherUpdate) {
        weatherUpdate.textContent = `更新于 ${formatTime(currentWeather.time)}`;
      }

      if (weatherLocation) {
        weatherLocation.textContent = WEATHER_LOCATION.label;
      }

      renderForecastChart(dailyWeather);

      if (forecastUpdate) {
        forecastUpdate.textContent = `更新于 ${formatTime(currentWeather.time)}`;
      }
    } catch (error) {
      console.error(error);
      setWeatherErrorState();
    }
  };

  weatherTicker.setAttribute("aria-busy", "true");
  loadRealtimeWeather().finally(() => {
    weatherTicker.setAttribute("aria-busy", "false");
  });
  window.setInterval(loadRealtimeWeather, 10 * 60 * 1000);

  if (slides.length > 1) {
    window.setInterval(() => {
      activeIndex = (activeIndex + 1) % slides.length;
      showSlide(activeIndex);
    }, 2600);
  }
}
