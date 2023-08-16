import * as cheerio from "cheerio";
import { axiosPSLInstance } from "../axios.js";

export const getPSLTable = async () => {
  const log = [];
  const { data } = await axiosPSLInstance().get("/?type=log");

  const $ = cheerio.load(data);
  const table = $("#table-standings-logs tbody tr");
  table.each((index, element) => {
    const team = $(element).find(".logs-team h6.team-meta__name").text();
    const link = $(element).find(".logs-team .team-meta a").attr("href");
    const badge = $(element)
      .find(".logs-team .team-meta__logo img")
      .attr("src");
    const played = $(element).find(".logs-played").text();
    const win = $(element).find(".logs-win").text();
    const draw = $(element).find(".logs-draw").text();
    const lost = $(element).find(".logs-lost").text();
    const goalDifference = $(element).find(".logs-goal-diff").text();
    const points = $(element).find(".logs-points").text();
    log.push({
      position: ++index,
      team,
      badge,
      played,
      win,
      draw,
      lost,
      goalDifference,
      points,
      link,
    });
  });
  if (log.length === 0) {
    throw new Error("Failed to get log at this time");
  }
  return log;
};

export const getPSLResults = async () => {
  const resultsArr = [];
  const { data } = await axiosPSLInstance().get("/?type=results");

  const $ = cheerio.load(data);

  const results = $("#table-standings-results tbody");
  results.each((_, body) => {
    const row = $(body).find("tr");
    const team1 = row.find(".results-team1 .team-meta__name").text();
    const team1Badge = row
      .find(".results-team1 .team-meta .team-meta__logo img")
      .attr("src");
    const team2 = row.find(".results-team2 .team-meta__name").text();
    const team2Badge = row
      .find(".results-team2 .team-meta .team-meta__logo img")
      .attr("src");
    const host = row
      .find(".results-footer-row .results-footer-block")
      .text()
      .split("-");

    const location = host[1];
    const date = host[0];
    const score = row.find(".results-score span").text().split("-");
    const score1 = score[0];
    const score2 = score[1];

    resultsArr.push({
      host: {
        name: team1,
        score: score1.trim(),
        badge: team1Badge,
      },
      away: {
        name: team2,
        score: score2.trim(),
        badge: team2Badge,
      },
      location: location.trim(),
      date: date.trim(),
    });
  });

  return resultsArr;
};

export const getPSLFixtures = async () => {
  const resultsArr = [];
  const { data } = await axiosPSLInstance().get("/?type=fixtures");

  const $ = cheerio.load(data);

  const results = $("#table-standings-fixtures tbody");
  results.each((_, body) => {
    const row = $(body).find("tr");
    //Home team
    const team1 = row.find(".fixtures-team1 .team-meta__name").text();
    const team1Badge = row
      .find(".fixtures-team1 .team-meta .team-meta__logo img")
      .attr("src");
    //Away team
    const team2 = row.find(".fixtures-team2 .team-meta__name").text();
    const team2Badge = row
      .find(".fixtures-team2 .team-meta .team-meta__logo img")
      .attr("src");
    //Match details
    const host = row
      .find(".fixtrures-footer-row .fixtures-footer-block")
      .text()
      .split("-");

    const location = host[1];
    const date = host[0];

    resultsArr.push({
      host: {
        name: team1,
        badge: team1Badge,
      },
      away: {
        name: team2,
        badge: team2Badge,
      },
      location: location.trim(),
      date: date.trim(),
    });
  });

  return resultsArr.slice(0, 10);
};
