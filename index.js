const express = require("express");
const app = express();
const axios = require('axios');

const config = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
    },
};
const leag_ids = [9774, 10204, 11440, 9757, 9989, 9860, 9908, 9707, 9785, 9832, 9829, 11433, 9702, 9722, 9802, 9890, 9796, 9756, 9816, 9994, 10208, 9955, 9792, 11436, 9768, 9806, 9884, 9837, 11274, 9786, 9834, 9769, 9878, 9764, 9820, 9826]
const names = ['Argentina', 'Argentina', 'Australia', 'Austria', 'Belgium', 'Cyprus', 'Cyprus', 'Egypt', 'England', 'England', 'England', 'England', 'England', 'Ethiopia', 'France', 'France', 'France', 'Germany', 'Germany', 'Germany', 'Greece', 'Greece', 'Italy', 'Italy', 'Italy', 'Netherlands', 'Netherlands', 'Portugal', 'Portugal', 'Scotland', 'Scotland', 'Spain', 'Spain', 'Spain', 'Turkiye', 'Turkiye']
var leag = []
var leag_games = []
const add = [
    "3 Way",
    "Both teams to score",
    "Double chance",
    "Over/Under",
    "1st Half - 3 Way",
    "1st half - Over/Under",
    "1st Half - Correct score",
    "Halftime/Fulltime",
    "Exact goals",
    "Odd/even",
    "1st Half - Both teams to score",
    "3 Way & Over/Under",
    "3 Way & both teams to score",
    "Highest scoring half",
    "Goal range",
    "Double chance & Over/Under",
    "2nd half - 3 Way & both teams to score",
    "2nd half - correct score",
    "1st goal",
    "1st/2nd half both teams to score",
    "Last goal",
    "1st half - odd/even",
    "2nd half - double chance",
    "2nd half - odd/even",
    "Which team to score",
    "Correct score",
    "2nd Half - Both teams to score",
    "When will the 1st goal be scored (15 min interval)",
    "When will the 1st goal be scored (10 min interval)",
    "1st half - double chance",
    "Both halves under 1.5",
    "Both halves over 1.5",
    "2nd Half - Over/Under",
    "2nd half - 3 Way",
    "1st half - exact goals",
    "Handicap",
    "Double chance (match) & 2nd half both teams score",
    "Over/Under & both teams to score",
    "Double chance (match) & 1st half both teams score",
    "2nd half - double chance & both teams to score",
    "1st half - double chance & both teams to score",
    "2nd half - handicap 0:3",
    "Double chance & both teams to score",
]
app.get('/', async(req, res) => {
    var data = await axios({
    method: 'get',
    url: ''https://api.hulusport.com/sport-data/matches/?ln=en',
    timeout: 60 * 4 * 1000
  });
    var am = data.data
    games = [];
    for (var i = 0; i < am.length; i++) {
        if (leag_ids.indexOf(am[i].league) != -1) {
            url = 'https://api.hulusport.com/sport-data/matches/' + am[i].id + '/?ln=en'
            var val = await axios({
    method: 'get',
    url: url,
    timeout: 60 * 4 * 1000
  });
            data = val.data
            holder = [];
            var x = {};
            x.title = data.hom + ' Vs ' + data.awy
            h = data.schedule.split('T')[0].split('-')
            x.date = h[2] + '/' + h[1] + '/' + h[0] + ' ' + data.schedule.split('T')[1].split('+')[0]
            aman = data.items.sort(function(a, b) { return a.bet_group.order - b.bet_group.order })
            var prediction = [];
            aman.forEach(element => {
                if (add.indexOf(element.bet_group.name) != -1) {
                    ordered = element.odds.sort(function(a, b) { return a.bet_type.order - b.bet_type.order })
                    pre_holder = []
                    ordered.forEach(element => {
                        pred = element.bet_type.name.replace('draw', 'X').replace('{$competitor1}', 1).replace('{$competitor2}', 2).replace('{total}', element.item.specifier.total ? element.item.specifier.total : 0)
                        pre_holder.push({ prediction: pred, odd: element.odd, level: 0, counter: 0 })
                    });
                    prediction.push({ prediction: pre_holder, category: element.bet_group.name })
                }
            });
            x.prediction = prediction
            if (leag.indexOf(data.league.name) == -1) {
                leag.push(data.league.name)
                leag_games.push({ 'leag': names[leag_ids.indexOf(data.league.id)] + ' ' + data.league.name, games: [x] })
            } else {
                leag_games[leag.indexOf(data.league.name)].games.push(x)
            }
        }
    }

    return res.status(200).json(leag_games)
})
app.listen(process.env.PORT||3000)
