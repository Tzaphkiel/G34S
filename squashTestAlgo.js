// criterion score (end condition)
var theta = 10;
// Crossover rate
var Pco  = 0.05;
// Mutation rate
var Pmut = 0.01;
// Population size
var L = 1000;
var features = {
  court: {pos: 0, name: 'Court', max: 4, lastValid: 11b},
  Player1: {pos: 1, name: 'Player 1', max: 7, lastValid: 110b},
  player2: {pos: 2, name: 'Player 2', max: 7, lastValid: 110b},
  timeslot: {pos: 3, name: 'Timeslot', max: 6, lastValid: 101b}
};
// Chromosomes
var chromosomes = new Array();
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
  highestFitness = 0;
  do {
    var highestFitness = calcPopulationFitness(chromosomes, chromosomeByFitness);

    //-- generate offsprings
    nextGenChromosomes = []
    offspringCount =0
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
  var highestFitness = calcPopulationFitness(chromosomes, chromosomeByFitness);
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
function chromosomeValid(chromosome) {
  var chromosomeFeatures = extractFeatures(chromosome);
  for (feature in chromosomeFeatures){
    if (chromosomeFeatures[feature] > FEATURES_LIMIT[feature]) {
      return false;
    }
  }
  return true
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
  // TODO calculate FEATURES_LIMIT and init !
  for (var i=0;i<L;i++){
    chromosomes[i] = '1000101011101011'; // must be done randomly !
  }
}
