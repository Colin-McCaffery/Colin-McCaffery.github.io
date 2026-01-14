$(document).ready(function () {
    $('table.datatable').DataTable({
        searching: false,
        lengthChange: false,
        paging: false,
        info: false,
        order: [[12, 'desc']],
        createdRow: function (row) {
            var $cells = $('td', row);
            var $profitCell = $cells.eq(12);
            var profitText = $profitCell.text();
            var profitVal = parseFloat(profitText.replace(/[^0-9.-]/g, ''));
            $profitCell.removeClass('profit-positive profit-negative');
            if (!isNaN(profitVal)) {
                if (profitVal > 0) {
                    $profitCell.addClass('profit-positive');
                }
                else if (profitVal < 0) {
                    $profitCell.addClass('profit-negative');
                }
            }

            var dealIndices = [4, 10];
            dealIndices.forEach(function (idx) {
                var $dealCell = $cells.eq(idx);
                var dealText = $dealCell.text();
                var dealVal = parseFloat(dealText.replace(/[^0-9+.-]/g, ''));
                $dealCell.removeClass('profit-positive profit-negative');
                if (!isNaN(dealVal)) {
                    if (idx === 10) {
                        if (dealVal < 0) {
                            $dealCell.addClass('profit-negative');
                        }
                        else if (dealVal > 0) {
                            $dealCell.addClass('profit-positive');
                        }
                    }
                    else {
                        if (dealVal < 0) {
                            $dealCell.addClass('profit-positive');
                        }
                        else if (dealVal > 0) {
                            $dealCell.addClass('profit-negative');
                        }
                    }
                }
            });
        }
    });
});

const items = [
    "sapphire ring", "ring of recoil", "sapphire bracelet", "bracelet of clay",
    "sapphire necklace", "games necklace", "sapphire amulet", "amulet of magic",
    "opal ring", "ring of pursuit", "opal bracelet", "expeditious bracelet",
    "opal necklace", "dodgy necklace", "opal amulet", "amulet of bounty",
    "emerald ring", "ring of dueling", "emerald necklace", "binding necklace",
    "emerald bracelet", "castle wars bracelet", "emerald amulet", "amulet of defence",
    "jade ring", "ring of returning", "jade bracelet", "flamtaer bracelet",
    "jade necklace", "necklace of passage", "jade amulet", "amulet of chemistry",
    "ruby ring", "ring of forging", "ruby bracelet", "inoculation bracelet",
    "ruby amulet", "amulet of strength", "topaz ring", "efaritay's aid",
    "topaz bracelet", "bracelet of slaughter", "topaz necklace", "necklace of faith",
    "topaz amulet", "burning amulet(5)", "diamond ring", "ring of life",
    "diamond necklace", "phoenix necklace", "diamond bracelet", "abyssal bracelet",
    "diamond amulet", "amulet of power", "dragonstone ring", "ring of wealth",
    "dragon necklace", "skills necklace", "dragonstone bracelet", "combat bracelet",
    "dragonstone amulet", "amulet of glory", "cosmic rune"
];

async function fetchJSON(url) {
    const res = await fetch(url, {
        headers: { "User-Agent": "jewelry enchantment-cost-calculator (Discord: colinmyth)" }
    });
    return res.json();
}

async function loadItemData() {
    const mapping = await fetchJSON("https://prices.runescape.wiki/api/v1/osrs/mapping");
    const nameToId = {};
    for (const item of mapping) {
        nameToId[item.name.toLowerCase()] = item.id;
    }

    const latest = await fetchJSON("https://prices.runescape.wiki/api/v1/osrs/latest");
    const fiveMin = await fetchJSON("https://prices.runescape.wiki/api/v1/osrs/5m");
    const sixHour = await fetchJSON("https://prices.runescape.wiki/api/v1/osrs/6h");

    function computeAverage(p, f) {
        const ah = f && typeof f.avgHighPrice === 'number' ? f.avgHighPrice : (p && typeof p.high === 'number' ? p.high : null);
        const al = f && typeof f.avgLowPrice === 'number' ? f.avgLowPrice : (p && typeof p.low === 'number' ? p.low : null);
        if (ah != null && al != null) return Math.round((ah + al) / 2);
        if (ah != null) return ah;
        if (al != null) return al;
        return null;
    }

    function computeAverage6h(s, p, f) {
        const ah = s && typeof s.avgHighPrice === 'number' ? s.avgHighPrice : (f && typeof f.avgHighPrice === 'number' ? f.avgHighPrice : (p && typeof p.high === 'number' ? p.high : null));
        const al = s && typeof s.avgLowPrice === 'number' ? s.avgLowPrice : (f && typeof f.avgLowPrice === 'number' ? f.avgLowPrice : (p && typeof p.low === 'number' ? p.low : null));
        if (ah != null && al != null) return Math.round((ah + al) / 2);
        if (ah != null) return ah;
        if (al != null) return al;
        return null;
    }

    function computeDealPct(low, high, avg) {
        const hasLow = typeof low === 'number';
        const hasHigh = typeof high === 'number';
        if ((hasLow || hasHigh) && typeof avg === 'number' && avg > 0) {
            const effectiveLow = hasLow && hasHigh ? Math.min(low, high) : (hasLow ? low : high);
            const pct = ((effectiveLow - avg) / avg) * 100;
            const rounded = Math.round(pct * 10) / 10;
            return rounded.toFixed(1) + '%';
        }
        return '';
    }

    const runeName = items[items.length - 1];
    const runeId = nameToId[runeName.toLowerCase()];
    const runeLatest = runeId ? latest.data[runeId] : null;
    const runeFive = runeId ? fiveMin.data[runeId] : null;
    const enchantCost = computeAverage(runeLatest, runeFive) || 0;

    const rows = [];
    for (let i = 0; i < items.length - 1; i += 2) {
        const item1Name = items[i];
        const item2Name = items[i + 1];
        const id1 = nameToId[item1Name.toLowerCase()];
        const id2 = nameToId[item2Name.toLowerCase()];
        if (!id1 || !id2) continue;

        const p1 = latest.data[id1] || {};
        const p2 = latest.data[id2] || {};
        const f1 = fiveMin.data[id1] || {};
        const f2 = fiveMin.data[id2] || {};
        const s1 = sixHour.data[id1] || {};
        const s2 = sixHour.data[id2] || {};

        const low1 = typeof p1.low === 'number' ? p1.low : null;
        const high1 = typeof p1.high === 'number' ? p1.high : null;
        const avg1 = computeAverage(p1, f1) || 0;
        const avg6h1 = computeAverage6h(s1, p1, f1) || 0;
        const deal1 = computeDealPct(low1, high1, avg6h1);

        const low2 = typeof p2.low === 'number' ? p2.low : null;
        const high2 = typeof p2.high === 'number' ? p2.high : null;
        const avg2 = computeAverage(p2, f2) || 0;
        const avg6h2 = computeAverage6h(s2, p2, f2) || 0;
        const vol1 = (
            (typeof s1.highPriceVolume === 'number' ? s1.highPriceVolume : 0) +
            (typeof s1.lowPriceVolume === 'number' ? s1.lowPriceVolume : 0)
        );

        const vol2 = (
            (typeof s2.highPriceVolume === 'number' ? s2.highPriceVolume : 0) +
            (typeof s2.lowPriceVolume === 'number' ? s2.lowPriceVolume : 0)
        );

        const profit = (avg2 - avg1 - enchantCost);

        const deal2 = computeDealPct(low2, high2, avg6h2);

        rows.push([
            item1Name,
            low1,
            avg1,
            high1,
            deal1,
            vol1,
            item2Name,
            low2,
            avg2,
            high2,
            deal2,
            vol2,
            profit
        ]);
    }

    var dt = $('#jewelry').DataTable();
    dt.clear();
    dt.rows.add(rows);
    dt.draw();
}

loadItemData();
