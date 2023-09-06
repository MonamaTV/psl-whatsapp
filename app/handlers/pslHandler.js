import { errorMessage, msg } from "../messages.js";
import { getPSLFixtures, getPSLResults, getPSLTable } from "../scraper/psl.js";
import { sendWhatsappMessage } from "../twilio.js";

export const PSLUpdates = async (req, res) => {
  const sender = req.body.To;
  const receiver = req.body.From;
  try {
    const message = req.body?.Body;
    if (!message) {
      await sendWhatsappMessage(sender, receiver, errorMessage);

      return;
    }
    if (message.toLowerCase() === "hi") {
      await sendWhatsappMessage(sender, receiver, msg);

      return;
    } else if (message.toLowerCase() === "table") {
      const results = await getPSLTable();

      let strMessage = "*PSL Table* \n\n";

      results.forEach((result) => {
        strMessage += `${result.position}. ${result.team}: ${result.win} W, ${result.lost} L, ${result.draw} D, ${result.points} PTS\n`;
      });

      await sendWhatsappMessage(sender, receiver, strMessage);
    } else if (message.toLowerCase() === "results") {
      const results = await getPSLResults();

      let resultMessage = "*Results* \n\n";

      results.slice(0, 10).forEach(({ host, away, location, date }) => {
        resultMessage += `${host.name} ${host.score} - ${away.score} ${away.name}\n`;
        resultMessage += `${location} - ${date}\n\n`;
      });

      await sendWhatsappMessage(sender, receiver, resultMessage);
    } else if (message.toLowerCase() === "fixtures") {
      const results = await getPSLFixtures();

      let strMessages = "*Upcoming games*\n\n";

      results.forEach(({ host, away, location, date }) => {
        strMessages += `${host.name} vs. ${away.name}\n${location} ${
          date && "-"
        } ${date} \n\n`;
      });

      await sendWhatsappMessage(sender, receiver, strMessages);
    } else {
      await sendWhatsappMessage(sender, receiver, errorMessage);
    }
  } catch (error) {
    return res.status(400).json({
      message: "Failed to get PSL fixtures",
      success: false,
    });
  }
};

// export const fetchTable = async (req, res) => {
//   try {
//     const results = await getPSLTable();
//     if (req.query?.team) {
//       const result = results.find((team) =>
//         team.team.toLowerCase().includes(req.query.team.toLowerCase())
//       );
//       return res.json({
//         message: "Team information",
//         success: true,
//         data: result,
//       });
//     }
//     res.status(200).json({
//       message: "PSL log",
//       results: results.length,
//       success: true,
//       data: results,
//     });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(400).json({
//       message: "Failed to get PSL log",
//       success: false,
//     });
//   }
// };

// export const fetchResults = async (req, res) => {
//   try {
//     const results = await getPSLResults();

//     if (req.query?.team) {
//       const result = results.filter(({ host, away }) => {
//         return (
//           host.name.toLowerCase().includes(req.query.team.toLowerCase()) ||
//           away.name.toLowerCase().includes(req.query.team.toLowerCase())
//         );
//       });
//       return res.json({
//         message: "Team results",
//         success: true,
//         data: result,
//       });
//     }
//     res.status(200).json({
//       message: "PSL results",
//       success: true,
//       data: results,
//       results: results.length,
//     });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(400).json({
//       message: "Failed to get PSL fixtures",
//       success: false,
//     });
//   }
// };
