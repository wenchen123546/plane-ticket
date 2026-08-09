import { airports } from '../data/airports';

// 產生模擬的機票價格資料，供趨勢圖表使用
export const generatePriceData = (days = 30) => {
  const data = [];
  const today = new Date();
  
  // 設定一個基準價格
  let currentPrice = 12000; 

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // 價格隨機波動 (-500 ~ +800)
    const fluctuation = Math.floor(Math.random() * 1300) - 500;
    currentPrice += fluctuation;
    
    // 確保價格不低於一個底線
    if (currentPrice < 8000) currentPrice = 8000 + Math.random() * 1000;
    
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      price: currentPrice,
      // 假設未來趨勢有另一個預測值 (僅在最後幾天顯示)
      predictedPrice: i <= 5 ? currentPrice + (Math.floor(Math.random() * 1000) - 300) : null,
    });
  }
  return data;
};

export const getDetailedAircraftStats = (aircraft) => {
  const model = aircraft || '';
  
  if (model.includes('A380')) {
    return {
      pitch: '33-34 吋',
      width: '18.5 吋',
      noise: '極低 (雙層巨無霸隔音極佳)',
      pressure: '舒適',
      ife: '13 吋 4K 娛樂系統 (包含尾翼攝影機)',
      wifi: '提供全航段免費 Wi-Fi (視艙等)',
      power: 'USB-C & 110V 萬國插座',
      scores: { space: 100, quiet: 95, tech: 90, comfort: 99 }
    };
  } else if (model.includes('A350') || model.includes('787')) {
    return {
      pitch: '32-34 吋',
      width: '18 吋',
      noise: '極低 (新世代引擎)',
      pressure: '舒適 (艙壓較低，不易疲勞)',
      ife: '12 吋 4K 個人螢幕',
      wifi: '提供高速 Wi-Fi',
      power: 'USB-C & 110V 插座',
      scores: { space: 95, quiet: 98, tech: 95, comfort: 96 }
    };
  } else if (model.includes('777') || model.includes('A330')) {
    return {
      pitch: '31-32 吋',
      width: '17.5 吋',
      noise: '中等',
      pressure: '標準',
      ife: '9-11 吋個人螢幕',
      wifi: '提供一般 Wi-Fi',
      power: 'USB-A 插座',
      scores: { space: 85, quiet: 75, tech: 80, comfort: 82 }
    };
  } else if (model.includes('A321') || model.includes('737')) {
    return {
      pitch: '28-30 吋',
      width: '17 吋',
      noise: '較高',
      pressure: '標準',
      ife: '無個人螢幕 / 僅提供自攜設備串流',
      wifi: '部分航班提供',
      power: '僅部分座位提供 USB',
      scores: { space: 70, quiet: 65, tech: 60, comfort: 68 }
    };
  }
  return {
    pitch: '30 吋',
    width: '17 吋',
    noise: '標準',
    pressure: '標準',
    ife: '視航班而定',
    wifi: '視航班而定',
    power: '視航班而定',
    scores: { space: 75, quiet: 75, tech: 70, comfort: 75 }
  };
};

export const getRecommendations = (currentPrice) => {
  if (currentPrice < 10000) {
    return {
      status: 'excellent',
      title: '絕佳買點！',
      message: '目前的價格低於歷史平均，強烈建議現在購買。',
      actionText: '立即訂購'
    };
  } else if (currentPrice < 13000) {
    return {
      status: 'good',
      title: '價格平穩',
      message: '目前價格落在合理區間，若行程確定可以考慮入手。',
      actionText: '查看航班'
    };
  } else {
    return {
      status: 'wait',
      title: '建議觀望',
      message: '近期價格偏高，建議設定價格提醒，等待價格回落。',
      actionText: '設定提醒'
    };
  }
};

export const getProviderPrices = (basePrice) => {
  const providers = [
    { name: '官方航空 (Official)', type: 'airline', fee: 0, timeAvg: '直飛' },
    { name: 'Skyscanner', type: 'ota', fee: 200, timeAvg: '多種選擇' },
    { name: 'Trip.com', type: 'ota', fee: 0, timeAvg: '直飛/轉機' },
    { name: 'Expedia', type: 'ota', fee: 450, timeAvg: '直飛' },
    { name: 'Agoda', type: 'ota', fee: 150, timeAvg: '直飛' },
    { name: '易遊網 (ezTravel)', type: 'ota', fee: 100, timeAvg: '直飛' }
  ];

  return providers.map(p => {
    const diff = Math.floor(Math.random() * 1100) - 300;
    const finalPrice = basePrice + diff + p.fee;
    
    return {
      ...p,
      price: finalPrice,
      isBest: false
    };
  }).sort((a, b) => a.price - b.price).map((p, i) => ({ ...p, isBest: i === 0 }));
};

export const airlines = [...new Set([
  // 台灣與亞洲傳統航空 (Asian Full Service)
  '長榮航空 (EVA Air)', '中華航空 (China Airlines)', '星宇航空 (STARLUX)', '華信航空 (Mandarin Airlines)', '立榮航空 (UNI Air)',
  '國泰航空 (Cathay Pacific)', '香港航空 (Hong Kong Airlines)', '澳門航空 (Air Macau)',
  '日本航空 (JAL)', '全日空 (ANA)', '大韓航空 (Korean Air)', '韓亞航空 (Asiana Airlines)',
  '新加坡航空 (Singapore Airlines)', '馬來西亞航空 (Malaysia Airlines)', '泰國國際航空 (Thai Airways)',
  '越南航空 (Vietnam Airlines)', '印尼鷹航 (Garuda Indonesia)', '斯里蘭卡航空 (SriLankan Airlines)',
  // 中國大陸航空 (Mainland China)
  '中國南方航空 (China Southern)', '中國東方航空 (China Eastern)', '中國國際航空 (Air China)', '廈門航空 (XiamenAir)', '海南航空 (Hainan Airlines)', '四川航空 (Sichuan Airlines)', '春秋航空 (Spring Airlines)', '吉祥航空 (Juneyao Air)',
  // 歐洲與俄羅斯 (Europe & Russia)
  '法國航空 (Air France)', '英國航空 (British Airways)', '德國漢莎航空 (Lufthansa)', 
  '荷蘭皇家航空 (KLM)', '瑞士國際航空 (SWISS)', '芬蘭航空 (Finnair)', '土耳其航空 (Turkish Airlines)',
  '維珍航空 (Virgin Atlantic)', '北歐航空 (SAS)', '俄羅斯航空 (Aeroflot)', '西班牙國家航空 (Iberia)', '義大利航空 (ITA Airways)', '愛爾蘭航空 (Aer Lingus)', '奧地利航空 (Austrian Airlines)',
  // 美洲航空 (Americas)
  '聯合航空 (United Airlines)', '達美航空 (Delta Air Lines)', '美國航空 (American Airlines)', '加拿大航空 (Air Canada)',
  '夏威夷航空 (Hawaiian Airlines)', '拉塔姆航空 (LATAM Airlines)', '阿拉斯加航空 (Alaska Airlines)', '墨西哥航空 (Aeromexico)', '西捷航空 (WestJet)',
  // 紐澳與南亞 (Oceania & South Asia)
  '澳洲航空 (Qantas)', '紐西蘭航空 (Air New Zealand)', '印度航空 (Air India)', '維珍澳洲 (Virgin Australia)', '捷星澳洲 (Jetstar Airways)',
  '菲律賓航空 (Philippine Airlines)', '斐濟航空 (Fiji Airways)',
  // 中東奢華航空 (Middle Eastern)
  '阿聯酋航空 (Emirates)', '卡達航空 (Qatar Airways)', '阿提哈德航空 (Etihad Airways)', '沙烏地阿拉伯航空 (Saudia)', '以色列航空 (EL AL)', '阿曼航空 (Oman Air)', '皇家約旦航空 (Royal Jordanian)',
  // 廉價航空 (Low Cost Carriers)
  '台灣虎航 (Tigerair Taiwan)', '樂桃航空 (Peach)', '酷航 (Scoot)', '亞洲航空 (AirAsia)', 
  '捷星航空 (Jetstar)', '宿霧太平洋航空 (Cebu Pacific)', '越捷航空 (VietJet Air)', '德威航空 (T\'way Air)', '濟州航空 (Jeju Air)', '真航空 (Jin Air)', '首爾航空 (Air Seoul)', '釜山航空 (Air Busan)',
  '瑞安航空 (Ryanair)', '易捷航空 (easyJet)', '西南航空 (Southwest Airlines)', '捷藍航空 (JetBlue)', '威茲航空 (Wizz Air)', '邊疆航空 (Frontier Airlines)', '精神航空 (Spirit Airlines)',
  
  // 大量新增航空公司
  '星悅航空 (StarFlyer)', '天馬航空 (Skymark Airlines)', '空之子航空 (Solaseed Air)', '泰國亞洲航空 (Thai AirAsia)', '印尼亞洲航空 (Indonesia AirAsia)',
  '全亞洲航空 (AirAsia X)', '酷鳥航空 (NokScoot)', '皇雀航空 (Nok Air)', '曼谷航空 (Bangkok Airways)', '緬甸國際航空 (Myanmar Airways International)',
  '巴基斯坦國際航空 (PIA)', '孟加拉航空 (Biman Bangladesh Airlines)', '尼泊爾航空 (Nepal Airlines)',
  '長龍航空 (Loong Air)', '成都航空 (Chengdu Airlines)', '華夏航空 (China Express Airlines)', '奧凱航空 (Okay Airways)', '祥鵬航空 (Lucky Air)',
  '烏拉爾航空 (Ural Airlines)', 'S7航空 (S7 Airlines)', '波羅的海航空 (airBaltic)', '挪威航空 (Norwegian Air Shuttle)', '冰島航空 (Icelandair)',
  'LOT波蘭航空 (LOT Polish Airlines)', '捷克航空 (Czech Airlines)', '克羅埃西亞航空 (Croatia Airlines)', '塞爾維亞航空 (Air Serbia)', '羅馬尼亞航空 (TAROM)',
  '保加利亞航空 (Bulgaria Air)', '愛琴海航空 (Aegean Airlines)', '塞浦路斯航空 (Cyprus Airways)', '馬爾他航空 (Air Malta)',
  '葡萄牙航空 (TAP Air Portugal)', '布魯塞爾航空 (Brussels Airlines)', '盧森堡航空 (Luxair)',
  '太陽城航空 (Sun Country Airlines)', '忠實航空 (Allegiant Air)', '波特航空 (Porter Airlines)', '越洋航空 (Air Transat)',
  '巴拿馬航空 (Copa Airlines)', '哥倫比亞航空 (Avianca)', '高爾航空 (GOL Airlines)', '阿根廷航空 (Aerolíneas Argentinas)',
  '肯亞航空 (Kenya Airways)', '衣索比亞航空 (Ethiopian Airlines)', '埃及航空 (EgyptAir)', '摩洛哥皇家航空 (Royal Air Maroc)', '南非航空 (South African Airways)',
  '模里西斯航空 (Air Mauritius)', '塞席爾航空 (Air Seychelles)',
  
  // 更多廉航與新興航空
  '易斯達航空 (Eastar Jet)', '普雷米婭航空 (Air Premia)', '越竹航空 (Bamboo Airways)', 
  '泰國獅子航空 (Thai Lion Air)', '獅子航空 (Lion Air)', '巴提克航空 (Batik Air)',
  '飛馬航空 (Pegasus Airlines)', '沙迦航空 (Air Arabia)', '杜拜航空 (flydubai)',
  '大灣區航空 (Greater Bay Airlines)', '香港快運 (HK Express)',
  
  // 世界各國國營/旗艦/地區航空大補帖 (Global Exhaustive Additions)
  '汶萊皇家航空 (Royal Brunei Airlines)', '海灣航空 (Gulf Air)', '中東航空 (Middle East Airlines)', 
  '阿斯塔納航空 (Air Astana)', '烏茲別克航空 (Uzbekistan Airways)', '蒙古民用航空 (MIAT Mongolian Airlines)',
  '孟加拉航空 (Biman Bangladesh Airlines)', '巴基斯坦國際航空 (PIA)', '土庫曼航空 (Turkmenistan Airlines)',
  '哈薩克景觀航空 (SCAT Airlines)', '吉爾吉斯航空 (Avia Traffic Company)',
  '盧安達航空 (RwandAir)', '安哥拉航空 (TAAG Angola Airlines)', '納米比亞航空 (Air Namibia)', 
  '突尼斯航空 (Tunisair)', '阿爾及利亞航空 (Air Algérie)', '迦納航空 (Ghana Airways)', 
  '坦尚尼亞航空 (Air Tanzania)', '烏干達航空 (Uganda Airlines)', '模里西斯航空 (Air Mauritius)',
  '加勒比海航空 (Caribbean Airlines)', '巴哈馬航空 (Bahamasair)', '古巴航空 (Cubana de Aviación)', 
  '牙買加航空 (Air Jamaica)', '開曼航空 (Cayman Airways)', '玻利維亞航空 (BoA)', 
  '委內瑞拉航空 (Conviasa)', '蘇利南航空 (Surinam Airways)', '厄瓜多航空 (TAME)',
  '愛沙尼亞航空 (Nordica)', '冰島航空 (Icelandair)', '法羅群島航空 (Atlantic Airways)', 
  '格陵蘭航空 (Air Greenland)', '阿爾巴尼亞航空 (Air Albania)', '亞美尼亞航空 (Air Armenia)', 
  '喬治亞航空 (Georgian Airways)', '亞塞拜然航空 (AZAL)', '白俄羅斯航空 (Belavia)',
  '斐濟航空 (Fiji Airways)', '大溪地航空 (Air Tahiti Nui)', '喀里多尼亞航空 (Aircalin)', 
  '萬那杜航空 (Air Vanuatu)', '索羅門航空 (Solomon Airlines)', '巴布亞紐幾內亞航空 (Air Niugini)',
  '尼泊爾航空 (Nepal Airlines)', '不丹皇家航空 (Drukair)', '馬爾地夫航空 (Maldivian)',
  '科威特航空 (Kuwait Airways)', '阿曼航空 (Oman Air)', '皇家約旦航空 (Royal Jordanian)',
  '伊拉克航空 (Iraqi Airways)', '敘利亞航空 (Syrian Air)', '葉門航空 (Yemenia)'
])];

const aircrafts = [
  'Boeing 777-300ER', 'Boeing 787-9 Dreamliner', 'Boeing 737 MAX 8', 'Boeing 747-8',
  'Airbus A350-900', 'Airbus A321neo', 'Airbus A330-300', 'Airbus A380-800'
];

export const generateFlights = (origin, dest, date, isReturn = false, directOnly = false, preferredAirline = null) => {
  const count = Math.floor(Math.random() * 8) + 4; // 4 to 11 flights for more choices
  const flights = [];
  
  // Base date parsing or fallback to today
  let baseDate = new Date();
  if (date) {
    const parsed = new Date(date);
    if (!isNaN(parsed)) baseDate = parsed;
  }
  
  for (let i = 0; i < count; i++) {
    const airline = preferredAirline || airlines[Math.floor(Math.random() * airlines.length)];
    const aircraft = aircrafts[Math.floor(Math.random() * aircrafts.length)];
    const flightNum = `${airline.substring(0, 2)}${Math.floor(Math.random() * 800) + 100}`;
    
    // random departure time offset from baseDate (0 to 18 hours)
    const depOffsetHours = Math.floor(Math.random() * 18);
    const depOffsetMins = Math.floor(Math.random() * 12) * 5;
    
    const depTime = new Date(baseDate);
    depTime.setHours(depTime.getHours() + depOffsetHours, depOffsetMins, 0, 0);
    
    // Calculate realistic duration based on origin and dest continents
    let minDur = 2;
    let maxDur = 4;
    
    const origData = airports.find(a => a.value === (isReturn ? dest : origin));
    const destData = airports.find(a => a.value === (isReturn ? origin : dest));
    
    if (origData && destData) {
      if (origData.continent === destData.continent) {
        if (origData.country === destData.country) {
          minDur = 1; maxDur = 2; // Domestic
        } else {
          minDur = 2; maxDur = 5; // Regional
        }
      } else {
        minDur = 10; maxDur = 15; // Intercontinental
      }
    }
    
    const durationHours = Math.floor(Math.random() * (maxDur - minDur + 1)) + minDur;
    const durationMins = Math.floor(Math.random() * 12) * 5;
    
    const arrTime = new Date(depTime);
    arrTime.setHours(depTime.getHours() + durationHours, depTime.getMinutes() + durationMins);
    
    const stops = directOnly ? 0 : (Math.random() > 0.7 ? 1 : 0);
    
    // Adjust base price based on airline type
    const isLCC = ['台灣虎航', '樂桃', '酷航', '亞洲航空', '捷星', '宿霧太平洋', '越捷', '瑞安', '易捷', '西南', '捷藍'].some(lcc => airline.includes(lcc));
    let basePrice = (durationHours * 1200) + (Math.random() * 3000) + 5000;
    if (isLCC) basePrice = basePrice * 0.55; // LCCs are much cheaper
    if (['阿聯酋', '卡達', '阿提哈德', '沙烏地', '星宇', '新加坡', '維珍'].some(p => airline.includes(p))) basePrice = basePrice * 1.3; // Premium pricing
    
    flights.push({
      id: `${isReturn ? 'ret' : 'out'}-${i}`,
      airline,
      flightNum,
      aircraft,
      departure: {
        time: depTime,
        airport: isReturn ? dest : origin
      },
      arrival: {
        time: arrTime,
        airport: isReturn ? origin : dest
      },
      duration: `${durationHours}h ${durationMins}m`,
      stops,
      price: Math.floor(basePrice)
    });
  }
  
  return flights.sort((a, b) => a.price - b.price); // Default sort by price
};

export const generatePriceMatrix = (baseDate) => {
  const matrix = [];
  let centerDate = new Date();
  if (baseDate) {
    const parsed = new Date(baseDate);
    if (!isNaN(parsed)) centerDate = parsed;
  }
  
  // Create a 3x3 grid (3 departure dates, 3 return dates usually, but we can do a 1D array of 7 days around the departure)
  // Let's do a 7-day strip centered around the departure date for a cleaner UI, or a 3x3 if they have return date.
  // We'll return a 1D array of 7 days for the "Departure Flexible Dates"
  for (let i = -3; i <= 3; i++) {
    const d = new Date(centerDate);
    d.setDate(centerDate.getDate() + i);
    // Random price between 8000 and 25000, but make the center day average, and maybe a weekend spike
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const baseP = 12000 + (isWeekend ? 3000 : 0);
    const fluctuation = (Math.random() - 0.5) * 4000;
    
    matrix.push({
      date: d,
      price: Math.floor(baseP + fluctuation),
      offset: i // -3 to +3
    });
  }
  return matrix;
};

export const getAircraftAnalysis = (aircraftType) => {
  const analysis = {
    'Airbus A380-800': { score: 99, legroom: '33 吋', wifi: true, power: true, quietness: '極靜音 (巨無霸客機)' },
    'Boeing 747-8': { score: 90, legroom: '32 吋', wifi: true, power: true, quietness: '中等 (空中女王)' },
    'Boeing 777-300ER': { score: 85, legroom: '32 吋', wifi: true, power: true, quietness: '中等' },
    'Boeing 787-9 Dreamliner': { score: 95, legroom: '32 吋', wifi: true, power: true, quietness: '極靜音 (氣壓佳)' },
    'Airbus A350-900': { score: 98, legroom: '33 吋', wifi: true, power: true, quietness: '極靜音' },
    'Airbus A321neo': { score: 75, legroom: '30 吋', wifi: false, power: true, quietness: '普通 (窄體機)' },
    'Airbus A330-300': { score: 80, legroom: '31 吋', wifi: false, power: false, quietness: '普通' },
    'Boeing 737 MAX 8': { score: 70, legroom: '30 吋', wifi: false, power: false, quietness: '普通 (窄體機)' }
  };
  
  return analysis[aircraftType] || { score: 75, legroom: '31 吋', wifi: false, power: false, quietness: '未知' };
};

export const getAircraftReviews = () => {
  return [
    { aircraft: 'Airbus A380-800', author: '商務客 James', content: '雙層巨無霸真的非常安靜，平穩到幾乎感覺不到亂流，長途首選！', rating: 5 },
    { aircraft: 'Airbus A380-800', author: '家庭旅遊 Sarah', content: '空間超大，走道很寬敞，帶小孩飛 14 個小時也沒有崩潰。', rating: 5 },
    { aircraft: 'Boeing 787-9 Dreamliner', author: '常客背包客 威廉', content: '電子變色窗戶太酷了，機艙濕度與氣壓控制得很好，飛了 12 小時皮膚居然沒乾裂。', rating: 5 },
    { aircraft: 'Boeing 787-9 Dreamliner', author: '科技迷 Alex', content: '抗亂流系統真的有效，原本很怕暈機的我也睡得很安穩。', rating: 4 },
    { aircraft: 'Airbus A350-900', author: '攝影師 Chen', content: '尾翼攝影機視角超級讚，娛樂系統螢幕很大，引擎聲極度安靜。', rating: 5 },
    { aircraft: 'Airbus A350-900', author: '設計師 Lee', content: '客艙的 LED 情境燈光很棒，幫助調整時差非常有用。', rating: 5 },
    { aircraft: 'Boeing 747-8', author: '航空迷 Kevin', content: '能坐到空中女王真的是一種情懷，雖然設備不像最新世代那麼炫，但空間感無可挑剔。', rating: 4 },
    { aircraft: 'Boeing 777-300ER', author: '商務旅客 Emily', content: '非常經典的長程客機，引擎聲音稍大，但整體空間感與硬體還是很穩定的。', rating: 4 },
    { aircraft: 'Airbus A321neo', author: '輕旅行 王先生', content: '短程線來說很舒服，引擎聲音比舊款 A320 小很多，不過腿部空間偏普通。', rating: 3 },
    { aircraft: 'Boeing 737 MAX 8', author: '小資族 小林', content: '新的天空內裝讓壓迫感減少很多，不過畢竟是窄體客機，腿部空間對高個子來說還是有點擠。', rating: 3 },
    { aircraft: 'Airbus A330-300', author: '資深導遊 張姐', content: '中規中矩的廣體客機，2-4-2 的座位配置對情侶或雙人出遊非常友善，不用跟陌生人擠。', rating: 4 }
  ];
};
