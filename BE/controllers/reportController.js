import db from "../models/index.js";
const { Transaction, TransactionItem, Product } = db;
const { Op } = db.Sequelize;

/* ============================================================
   📌 1. SALES REPORT (untuk SalesReport.jsx)
   ============================================================ */
export const getSalesReport = async (req, res) => {
  try {
    const start_date = req.query.start_date || req.query.startDate;
    const end_date = req.query.end_date || req.query.endDate;

    const where = {};
    if (start_date && end_date) {
      where.created_at = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    }

    const transactions = await Transaction.findAll({
      where,
      include: [
        {
          model: TransactionItem,
          include: [
            { model: Product, attributes: ["title", "price", "category"] },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    let total_sales = 0;
    let total_revenue = 0;

    transactions.forEach((trx) => {
      trx.TransactionItems.forEach((item) => {
        total_sales += item.qty;
        total_revenue += item.subtotal_item;
      });
    });

    res.status(200).json({
      success: true,
      start_date,
      end_date,
      total_transactions: transactions.length,
      total_sales,
      total_revenue,
      transactions,
    });
  } catch (error) {
    console.error("❌ Error in getSalesReport:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil laporan penjualan",
      error: error.message,
    });
  }
};

/* ============================================================
   📌 2. DASHBOARD SUMMARY REPORT (UNTUK ADMINDASHBOARD)
   ============================================================ */
export const getDashboardReport = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        {
          model: TransactionItem,
          include: [
            { model: Product, attributes: ["title", "price", "category"] },
          ],
        },
      ],
    });

    let totalOrders = transactions.length;
    let totalOmzet = 0;
    let allMenu = 0;

    let foods = 0;
    let beverages = 0;
    let desserts = 0;

    // === MENU BREAKDOWN FOR MODALS ===
    const foodsList = {};
    const beveragesList = {};
    const dessertsList = {};

    // === AGGREGATE MAIN STATS & CATEGORY BREAKDOWN ===
    transactions.forEach((trx) => {
      totalOmzet += Number(trx.total || 0);

      trx.TransactionItems.forEach((item) => {
        const qty = Number(item.qty || 0);
        allMenu += qty;

        const prod = item.Product;
        if (!prod) return;

        const cat = (prod.category || "").toLowerCase();
        const name = prod.title;

        // global counter
        if (cat.includes("food")) {
          foods += qty;
          foodsList[name] = (foodsList[name] || 0) + qty;
        } else if (cat.includes("bever") || cat.includes("drink")) {
          beverages += qty;
          beveragesList[name] = (beveragesList[name] || 0) + qty;
        } else if (cat.includes("dessert") || cat.includes("cake")) {
          desserts += qty;
          dessertsList[name] = (dessertsList[name] || 0) + qty;
        }
      });
    });

    /* ============================================================
       📌 3. WEEKLY OMZET WITH FULL CATEGORY BREAKDOWN
       ============================================================ */
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklyTransactions = await Transaction.findAll({
      include: [
        {
          model: TransactionItem,
          include: [{ model: Product, attributes: ["title", "price", "category"] }],
        },
      ],
      where: {
        created_at: { [Op.between]: [startOfWeek, endOfWeek] },
      },
    });

    const weekly = {
      Mon: { day: "Mon", food: 0, beverage: 0, dessert: 0 },
      Tue: { day: "Tue", food: 0, beverage: 0, dessert: 0 },
      Wed: { day: "Wed", food: 0, beverage: 0, dessert: 0 },
      Thu: { day: "Thu", food: 0, beverage: 0, dessert: 0 },
      Fri: { day: "Fri", food: 0, beverage: 0, dessert: 0 },
      Sat: { day: "Sat", food: 0, beverage: 0, dessert: 0 },
      Sun: { day: "Sun", food: 0, beverage: 0, dessert: 0 },
    };

    weeklyTransactions.forEach((trx) => {
      trx.TransactionItems.forEach((item) => {
        const prod = item.Product;
        if (!prod) return;

        const qty = Number(item.qty || 0);
        const amount = Number(item.price * qty);

        const cat = (prod.category || "").toLowerCase();
        const dayIdx = new Date(trx.created_at).toLocaleDateString("en-US", {
          weekday: "short",
        });

        const row = weekly[dayIdx];
        if (!row) return;

        if (cat.includes("food")) row.food += amount;
        else if (cat.includes("bever") || cat.includes("drink"))
          row.beverage += amount;
        else if (cat.includes("dessert") || cat.includes("cake"))
          row.dessert += amount;
      });
    });

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalOmzet,
        allMenu,
        foods,
        beverages,
        desserts,

        // chart breakdown
        weekly: Object.values(weekly),

        // modal breakdown
        foodItems: Object.entries(foodsList).map(([title, total]) => ({
          title,
          total,
        })),
        beverageItems: Object.entries(beveragesList).map(([title, total]) => ({
          title,
          total,
        })),
        dessertItems: Object.entries(dessertsList).map(([title, total]) => ({
          title,
          total,
        })),
      },
    });
  } catch (error) {
    console.error("❌ Error getDashboardReport:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil laporan dashboard",
      error: error.message,
    });
  }
};
