import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 翻譯詞庫 (Translation Resources)
const resources = {
  en: {
    translation: {
      "app_title": "Nexus Flight",
      "search_flights": "Search Flights",
      "book_flights": "Book Flights",
      "saved_flights": "Saved Flights",
      "my_bookings": "My Bookings",
      "my_passport": "My Passport",
      "login_register": "Login / Sync",
      "language": "Language",
      "currency": "Currency",
      "origin": "Origin",
      "destination": "Destination",
      "departure_date": "Departure",
      "return_date": "Return",
      "passengers": "Passengers",
      "search_btn": "Search Flights",
      "one_way": "One Way",
      "round_trip": "Round Trip",
      "economy": "Economy",
      "premium": "Premium",
      "business": "Business",
      "first": "First Class",
      "flight_status": "Live Status",
      "check_in": "Check-in",
      "loading": "Loading...",
      "not_logged_in": "Not logged in",
      "multi_city": "Multi-City",
      "route_selection": "Route Selection",
      "add_flight_leg": "Add Flight Leg",
      "origin_continent": "Origin (Continent)",
      "origin_country": "Origin (Country)",
      "origin_airport": "Origin (Airport)",
      "dest_continent": "Destination (Continent)",
      "dest_country": "Destination (Country)",
      "dest_airport": "Destination (Airport)",
      "schedule_pax": "Schedule & Passengers",
      "optional_for_one_way": "(Optional for One-way)"
    }
  },
  'zh-TW': {
    translation: {
      "app_title": "Nexus 航班",
      "search_flights": "搜尋航班",
      "book_flights": "購票管理",
      "saved_flights": "已儲存航班",
      "my_bookings": "我的訂單",
      "my_passport": "親友護照資料",
      "login_register": "登入 / 註冊同步",
      "language": "語系 (Language)",
      "currency": "幣別 (Currency)",
      "origin": "出發地",
      "destination": "目的地",
      "departure_date": "去程日期",
      "return_date": "回程日期",
      "passengers": "乘客人數",
      "search_btn": "搜尋航班 🚀",
      "one_way": "單程",
      "round_trip": "來回",
      "economy": "標準經濟",
      "premium": "豪華經濟",
      "business": "商務尊榮",
      "first": "頭等艙",
      "flight_status": "航班動態",
      "check_in": "線上報到",
      "loading": "載入中...",
      "not_logged_in": "尚未登入",
      "multi_city": "多城市",
      "route_selection": "航線選擇 (Route)",
      "add_flight_leg": "新增航段",
      "origin_continent": "出發地 - 洲際 (Continent)",
      "origin_country": "出發地 - 國家 (Country)",
      "origin_airport": "出發地 - 機場 (Airport)",
      "dest_continent": "目的地 - 洲際 (Continent)",
      "dest_country": "目的地 - 國家 (Country)",
      "dest_airport": "目的地 - 機場 (Airport)",
      "schedule_pax": "時間與人數 (Schedule & Pax)",
      "optional_for_one_way": "(單程免填)"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh-TW',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
