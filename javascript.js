// A função getData serve para puxar do API o objeto com todas as informações de uma coin

// tickerList selects the parent div which will be used to add tickets inside itself
// coin is an object that will hold info about all coins
// coinPrint will hold updated data from coins, which will be used inside the updateData function
// coinList should hold coins' IDs, as they are shown in the ID list from coingecko's API. This will serve as a parameter, and the script will create tickers accordingly to the coins listed inside coinList
const tickerList = document.querySelector('.tickerList');
var coin = {};
var coinPrint = {};
var coinList = ['bitcoin' , 'ethereum' , 'ripple' , 'binancecoin' , 'litecoin' , 'solana' , 'cardano' , 'terra-luna' , 'hero-cat-token' , 'luna-rush' , 'bomber-coin', 'cardano' , 'chainlink'];


// GetData will use a coin ID as parameter. Then, it will create a key with that coin's ID inside the variable *coin*, whose value will be an object with all info from the API about that coin
const getData = async (uglyCoin) => {
    try {
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${uglyCoin}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
        coin[uglyCoin] = res.data;
    }
    catch(error) {
        console.log(error)
    }

}


// makeCoins() is an async function responsible for creating the tickers for the first time; using info from getData inside the foor loop, one coin at a time,
//it will get the coin's name, price, 24h variation and it's icon. Then, it will create the ticker and insert all info necessary.
async function makeCoins() {

    for (let i = 0; i < coinList.length; i++) {
        // executing the getData funcion
        await getData(coinList[i]);
       // attributing to coinPrint, a new object, information such as: name, price, 24h variation and icon 
        coinPrint.id = coin[coinList[i]].name;
        coinPrint.price = coin[coinList[i]].market_data.current_price.usd;
        coinPrint.var = coin[coinList[i]].market_data.price_change_percentage_24h;
        coinPrint.image = coin[coinList[i]].image.thumb;

        // creating a div with the class ticker and appending it to the div with the class tickerList
        const ticker = document.createElement('div');
        ticker.classList.add('ticker');
        tickerList.append(ticker);

        // creating the upper row of a ticker, which includes the coin's icon and name, each one of those elements is put inside a span;
        // rowSpan1 contains the icon and rowSpan2 contains the name
        const tickerRow1 = document.createElement('div');
        tickerRow1.classList.add('tickerRow1');
        ticker.appendChild(tickerRow1);
        
        const rowSpan1 = document.createElement('span');
        const icon = document.createElement('img');
        icon.src = coinPrint.image;
        icon.style.borderRadius = '100%';
        rowSpan1.append(icon);
        tickerRow1.appendChild(rowSpan1);
        
        // rowSpan2 has the coin's name with the first letter in uppercase (i.e. ethereum becomes Ethereum)
        const rowSpan2 = document.createElement('span');
        rowSpan2.innerText = coinPrint.id.charAt(0).toUpperCase() + coinPrint.id.slice(1);
        rowSpan2.style.color = 'white';
        tickerRow1.appendChild(rowSpan2);

        const rowSpan3 = document.createElement('span');
        const icon2 = document.createElement('img');
        icon2.src = coinPrint.image;
        icon2.style.borderRadius = '100%';
        rowSpan3.append(icon2);
        tickerRow1.appendChild(rowSpan3);


        // tickerRow2 is the bottom row of a ticker, and contains both price and 24h variation of the coin's price in percentage
        // span1 contains price, with default color white and span2 contains variation (color will depend if the 24h variation is positive or negative)
        const tickerRow2 = document.createElement('div');
        tickerRow2.classList.add('tickerRow2');
        ticker.appendChild(tickerRow2);
        const span1 = document.createElement('span');
        span1.classList.add('spans');
        span1.classList.add('spanPrice');
        span1.innerText = `$ ${coinPrint.price}`;
        span1.style.color = 'white';
        tickerRow2.appendChild(span1);

        const span2 = document.createElement('span');
        span2.classList.add('span2');
        span2.classList.add('spans');
        span2.innerText = `${coinPrint.var}%`;
        if (coinPrint.var < 0) {
            span2.style.color = 'rgb(255, 154, 154)';
        }
        else {
            span2.style.color = 'rgb(137, 255, 137)';
        }
        tickerRow2.appendChild(span2);


    }

}


//updateData is used to get new price and variation data, since other info won't have to be updated; then it will update values for price and variation
const updateData = async () => {
    // querySelectorAll will be used so we can change each coin's price and variation at a time, using the 'for' loop
    const allPrices = document.querySelectorAll('.spanPrice');
    const allVar = document.querySelectorAll('.span2');

for(let j=0; j<coinList.length;j++){
    await getData(coinList[j]);
    coinPrint.id = coin[coinList[j]].name;
    coinPrint.price = coin[coinList[j]].market_data.current_price.usd;
    coinPrint.priceStr = `${coinPrint.price}`;
    coinPrint.var = coin[coinList[j]].market_data.price_change_percentage_24h;
        // sets color depending if variation is positive or negative
        if (coinPrint.var < 0){
            allVar[j].style.color = 'rgb(255, 154, 154)';
        }
        else {
            allVar[j].style.color = 'rgb(137, 255, 137)';
        }

        // compares the previous price with the new one, if the new price is lower (meaning the price dropped) it will be printed with a red color, otherwise it will be printed with a green color. if price does not
        // change, it will maintain the last color printed
        if(coinPrint.priceStr == allPrices[j].innerText){
           
        } else if (parseFloat(coinPrint.priceStr) < parseFloat(allPrices[j].innerText.substring(2))){
            allPrices[j].style.color = 'rgb(255, 154, 154)';
        } else if (parseFloat(coinPrint.priceStr) > parseFloat(allPrices[j].innerText.substring(2))){
            allPrices[j].style.color = 'rgb(137, 255, 137)';}


    allPrices[j].innerText = `$ ${coinPrint.price}`;
    allVar[j].innerText = `${coinPrint.var}%`;

}
}
// updateDataInterval will run updateData once every second
const updateDataInterval = () => {
    setInterval(updateData , 1000);
}


makeCoins();
updateDataInterval();