require("chromedriver");

// const { table } = require("node:console");
// const { connect } = require("node:http2");
    let wd = require("selenium-webdriver");  //web driver

    let browser = new wd.Builder().forBrowser('chrome').build();

    let matchId = 35637;
    let innings = 2;



    let batsmenColumns= ["matches","innings","not out","runs","high score","average","best","strike rate","100","200","50","4s","6s"];
    let bowlersColumns =["match","inning","balls","runs","wicket","bbi","bbm","economy","average","strike rate","5w","10w"];

    let innings1Batsmen = [];
    let inningsBallers =[];
    let carrierdata = [];
    let fs = require('fs');

 async function main(){

        await browser.get(`https://www.cricbuzz.com/live-cricket-scores/${matchId}`);
        await browser.wait(wd.until.elementsLocated(wd.By.css(".cb-nav-bar a")));
        let buttons = await browser.findElements(wd.By.css(".cb-nav-bar a"));
        await buttons[1].click();
        await browser.wait(wd.until.elementsLocated(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`)));
        let tables = await browser.findElements(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`));
        // console.log(tables.length);

        let innings1BatsmenRows = await tables[0].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
        // console.log(innings1BatsmenRows.length);

        let FirstrowColumns = await innings1BatsmenRows[0].findElements(wd.By.css("div"));
        // console.log(FirstrowColumns.length);
        for(let i = 0; i < (innings1BatsmenRows.length); i++){
            let columns = await innings1BatsmenRows[i].findElements(wd.By.css("div"));

            if(columns.length == 7){
                let url = await (await columns[0].findElement(wd.By.css("a"))).getAttribute("href");
                let playername = await  columns[0].getAttribute("innerText");
                carrierdata.push({"player name ": playername});
                innings1Batsmen.push(url);

            }
            
        }
      

        let innings1BalllerRows = await tables[1].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));

        for(let i = 0; i < (innings1BalllerRows.length); i++){
            let columns = await innings1BalllerRows[i].findElements(wd.By.css("div"));

            if(columns.length == 8){
                let url = await (await columns[0].findElement(wd.By.css("a"))).getAttribute("href");
                // innings1Batsmen.push(url);
                let playername = await  columns[0].getAttribute("innerText");
                carrierdata.push({"player name ": playername});
                inningsBallers.push(url);
            }
            
        }
        let finalUrls =  innings1Batsmen.concat(inningsBallers);
        for(i in finalUrls){
            await browser.get(finalUrls[i]);

            await browser.wait(wd.until.elementsLocated(wd.By.css(".table.cb-col-100.cb-plyr-thead")));
            let tables = await browser.findElements(wd.By.css(".table.cb-col-100.cb-plyr-thead"));
            // console.log(tables.length);
            for(let j in tables){
                let data = {};
                let rows = await tables[j].findElements(wd.By.css("tbody tr"));
               
                for(let row of rows){
                    let tempdata = {};
                    let columns = await row.findElements(wd.By.css("td"));
                    let matchType = await columns[0].getAttribute("innerText");
                    let keyArr 
                    if(j == 0){
                        keyArr = batsmenColumns;
                    }
                    if(j == 1){
                        keyArr = bowlersColumns;
                    }
                    for(let k = 1; k < columns.length; k++){
                        tempdata[keyArr[k - 1]] = await columns[k].getAttribute("innerText");

                    }
                    data[matchType] = tempdata;
                }
                if(j == 0){
                    carrierdata[i]["battingCarrier"] = data;

                }else{
                    carrierdata[i]["bowlingCarrier"] = data;
                }
            }
            
        }
        // console.log(carrierdata);
        fs.writeFileSync("career.json",JSON.stringify(carrierdata));
   
      
    }

    main();