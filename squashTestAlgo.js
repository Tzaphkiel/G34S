
// criterion score (end condition)
var theta = 10;
// Crossover rate
var Pco  = 0.05;
// Mutation rate
var Pmut = 0.01;
// Population size
var L = 1000;
// feature definition (TODO generate based on input from user)
var features = {
  player1: {pos: 0, name: 'Player 1', maxVal: 7, numBit: 3, lastValid: parseInt('110', 2)},
  player2: {pos: 1, name: 'Player 2', maxVal: 7, numBit: 3, lastValid: parseInt('110', 2)},
  court: {pos: 2, name: 'Court', maxVal: 4, numBit: 2, lastValid: parseInt('11', 2)},
  timeslot: {pos: 3, name: 'Timeslot', maxVal: 6, numBit: 3, lastValid: parseInt('101', 2)}
};
// Chromosomes
var chromosomes = [];
initChromosomes(chromosomes, L, features);

//-- begin processing
start(chromosomes, theta, Pco, Pmut, L);


/**
 *
 */
function start(chromosomes) {
  // next generation population
  var nextGenChromosomes;
  var offspringCount;
  // fitness associative array {chromosome : fitness, ...}
  var chromosomeByFitness = {};
  var generation = 0;
  var offspring;
  var highestFitness=0;
  do {
    highestFitness = calcPopulationFitness(chromosomes, chromosomeByFitness);

    //-- generate offsprings
    nextGenChromosomes = [];
    offspringCount =0;
    do {
      //-- select two chromosomes from top 10% of population
      var fittestRange = L*0.1;
      var c1Index=Math.floor((Math.random()*fittestRange));
      var c2Index=Math.floor((Math.random()*fittestRange));
      
      while (c2Index == c1Index) {
        c2Index = Math.floor((Math.random()*fittestRange));
      }

      var pCrossover = Math.random();
      if (pCrossover > Pco) {
        offspring = crossOver(chromosomes, c1Index, c2Index);
      }
      else {
        offSpring = mutate(chromosomes, c1Index, Pmut);
      }

      //-- add to next generation's population
      nextGenChromosomes.push(offSpring);
      offspringCount++;
      generation++;
    } while (offspringCount < L);
    chromosomes = nextGenChromosomes;
  } while (highestFitness < theta);

  // re-calculate fitness as we are in the next generation already when we exit loop
  highestFitness = calcPopulationFitness(chromosomes, chromosomeByFitness);
  return chromosomes[0];
}


/**
 *
 */
function calcPopulationFitness(chromosomes, chromosomeByFitness){
  var highestFitness = 0;
  //-- calculate fitness of chromosomes
  for (var i=0;i<chromosomes.length;i++) {
    var chromosome = chromosomes[i];
    var fitness = calcFitness(chromosome);
    if (fitness > highestFitness)
      highestFitness = fitness;
    chromosomeByFitness[chromosome] = fitness;
  }

  //-- rank them
  chromosomes.sort(function(c1,c2) {return chromosomeByFitness[c2]-chromosomeByFitness[c1];});

  return highestFitness;
}


/** 
 *
 */
function chromosomeValid(chromosome, features) {
  var chromosomeFeatures = extractFeatures(chromosome, features);
  for (var feature in chromosomeFeatures){
    if (chromosomeFeatures[feature] >= features[feature].maxVal) {
      return false;
    }
  }
  return true;
}


/** 
 *
 */
function calcFitness(chromosome) {
  var score = 0;

  //TODO calculate the score 

  return score;
}


/** 
 *
 */
function initChromosomes(chromosomes, L, features) {
  for (var i=0;i<L;i++){
    var chromosome = '';
    for (var feature in features) {
      var v = Math.floor((Math.random()*feature.maxVal));
      chromosome.concat(v.toString(2));
    }
    chromosomes[i] = chromosome;
  }
}
