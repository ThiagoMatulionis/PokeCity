var prevPoke = "null";


async function manager(event)
{
    event.preventDefault();


    try
    {
        const weather = await getWeather(event.target[0].value);
        const pokemonType = await getPokemonType(weather);
        let pokemonName = getPokemon(pokemonType);
        print("A cidade de "
        + weather.name 
        + " está em "
        +weather.main.temp + "ºC<br>" 
        +"Chovendo: "
        +isRaining(weather),
        "<br>Pokemon: " + pokemonName
        +"<br>Tipo: "+ getTypeTranslated(pokemonType.name));
    }
    catch(e)
    {
        printErr(e);
    }
    
    
}

async function getWeather(city)
{
    //api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
    
    const apiKey = "75d4d9fa53f026dc053fc5dd9cd77bdf";

    const wUrl = new URL("http://api.openweathermap.org/data/2.5/weather");
    wUrl.searchParams.set("q", city);
    wUrl.searchParams.set("appid",apiKey);
    wUrl.searchParams.set("units","metric");

    const response = await fetch(wUrl);
    
    if(!response.ok)
    {
        const error = await response.json();
        throw error;
    }

    const weather = await response.json();
    return weather;
}

async function getPokemonType(weather)
{

    

    let typeName;


    //Fazer funcionar para todos os componentes do array
    if(!(weather.weather[0].main == "Rain"))
    {
        let temp = weather.main.temp;

        if(temp < 5)                        typeName = "ice";
        else if(temp < 10)                  typeName = "water";
        else if(temp >= 12 && temp < 15)    typeName = "grass";
        else if(temp >= 15 && temp < 21)    typeName = "ground";
        else if(temp >= 23 && temp < 27)    typeName = "bug";
        else if(temp >= 27 && temp <= 33)   typeName = "rock";
        else if(temp > 33)                  typeName = "fire";
        else                                typeName = "normal"; 
                 
    }
    else
    {
    
        typeName = "electric";
    }
    const pUrl = new URL(`https://pokeapi.co/api/v2/type/${typeName}`);

    const response = await fetch(pUrl);

    if(!response.ok)
    {
        const error = await response.json();
        throw error;
    }

    const type = await response.json();
    return type;
}

function getPokemon(type)
{
    
    let name;
    while(true)
    {
        name = type.pokemon[Math.floor(Math.random() * type.pokemon.length)].pokemon.name;
        if(prevPoke != name)
            break;
    }
    prevPoke = name; 
    
    name = name[0].toUpperCase() + name.slice(1);
    name = name.replace(/-/g, " ");

    return name;
}

function getTypeTranslated(typeName)
{
    switch(typeName)
    {
        case "electric" :   return "Elétrico";
        case "ice" :        return "Gelo";
        case "water" :      return "Água";
        case "grass" :      return "Grama";
        case "bug" :        return "Inseto";
        case "ground" :     return "Terra";
        case "rock" :       return "Pedra";
        case "fire" :       return "Fogo";
        case "normal" :     return "Normal";
    }

    /*
    Type ID
    {
        1 = "normal" *
        2 = "fighting"
        3 = "flying"
        4 = "poison"
        5 = "ground"*
        6 = "rock"*
        7 = "bug"*
        8 = "ghost"
        9 = "steel"
        10 = "fire"*
        11 = "water"*
        12 = "grass"*
        13 = "electric"*
        14 = "psychic"
        15 = "ice"*
        16 = "dragon"
        17 = "dark"
        18 = "fairy"
        19 = "unknown"
        20 = "shadow"
    }
    */ 
}

function isRaining(weather)
{
    let ret = weather.weather
        .map(item => 
                {
                    if(item.main == "Rain")
                        return true;
                    return false;
                }
                
            )

    if(ret[0] == false)
            return "Não";
    else
            return "Sim";
        
}

function print(mTemp,mPoke)
{
    const div1 = document.querySelector("#printTemp");

    div1.innerHTML = mTemp;

    const div2 = document.querySelector("#printPoke");

    div2.innerHTML = mPoke;
}

function printErr(error)
{
    const div = document.querySelector("#printTemp");

    if (error.cod == 404)
        div.innerHTML = "Cidade não encontrada<br>Erro:" + error.cod;
    else
        div.innerHTML = error

    document.querySelector("#printPoke").innerHTML = null;

}