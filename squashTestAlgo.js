// criterion score (end condition)
  var theta = 2;
  // Crossover rate
  var Pco  = 0.7;
  // Mutation rate
  var Pmut = 0.95;
  // Population size
  var L = 200;
  // feature definition (TODO generate based on input from user)
  var features = {
    player1: {startPos: 0, name: 'Player 1', maxVal: 7, numBit: 3, lastValid: parseInt('110', 2)},
    player2: {startPos: 3, name: 'Player 2', maxVal: 7, numBit: 3, lastValid: parseInt('110', 2)},
    court: {startPos: 6, name: 'Court', maxVal: 4, numBit: 2, lastValid: parseInt('11', 2)},
    timeslot: {startPos: 8, name: 'Timeslot', maxVal: 6, numBit: 3, lastValid: parseInt('101', 2)}
  };
  // Chromosomes
  var chromosomes = [];
  initChromosomes(chromosomes, L, features);
  var debug = '';
  for (var i=0;i<chromosomes.length;i++)
  	debug += ', ' + chromosomes[i];
  alert("chromosomes: " + debug);

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

        var prob = Math.random();
        if (prob > Pco) {
          var offsprings = crossOver(chromosomes, c1Index, c2Index);
	        nextGenChromosomes.push(offsprings[0]);
	        nextGenChromosomes.push(offsprings[1]);
	        offspringCount+=2;
        }
        else {
          var offspring = mutate(chromosomes, c1Index, Pmut);
          nextGenChromosomes.push(offspring);
	        offspringCount+=1;
        }

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
    chromosomes.sort(function(c1,c2) {
    	return chromosomeByFitness[c2]-chromosomeByFitness[c1]
    });

    return highestFitness;
  }


  /** 
   * Only function with feature definition that needs to be adapted for the algo to work properly !
   */
  function calcFitness(chromosome) {
    var score = 0;

    var chromosomeFeatures = extractFeatures(chromosome, features);
    
    if (chromosomeFeatures['player1'] != chromosomeFeatures['player2'])
    	score += 2;

    //TODO check opponents preference & ranking equivalence !

    return score;
  }


  /** 
   *
   */
  function extractFeatures(chromosome, features) {
    var ret= {};  
    for (var featureKey in features){
    	var feature = features[featureKey];
      var start = feature.startPos;
      var end = start + feature.numBit;
      ret[featureKey] = chromosome.slice(start, end);
    }
    return ret;
  }


  /** 
   *
   */
  function chromosomeValid(chromosome, features) {
    var chromosomeFeatures = extractFeatures(chromosome, features);
    for (var featureKey in chromosomeFeatures){
    	var chromosomeFeatureVal = chromosomeFeatures[featureKey];
      if (parseInt(chromosomeFeatureVal, 2) > features[featureKey].maxVal) {
        return false;
      }
    }
    return true;
  }


  /** 
   *
   */
  function mutate(chromosomes, c1Index, Pmut) {
  	var c1 = chromosomes[c1Index];
  	var cLen= c1.length;
  	for (var i=0;i<cLen;i++) {
  		var prob = Math.random();
  		if (prob > Pmut) {
  			// mutate bit !
  			if (c1[i] == '0')
					chromosomes[c1Index] = c1.substr(0, i) + '1' + c1.substr(i + 1);
  			else
					chromosomes[c1Index] = c1.substr(0, i) + '0' + c1.substr(i + 1);
  		}
  	}
  	return c1;
  }


  /** 
   *
   */
  function crossOver(chromosomes, c1Index, c2Index) {
  	var c1 = chromosomes[c1Index];
  	var c2 = chromosomes[c2Index];
  	var cLen = c1.length;
  	var splitPt = Math.floor((Math.random()*cLen));

		var newC1 = c2.slice(0,splitPt) + c1.slice(splitPt+1, cLen);
		var newC2 = c1.slice(0,splitPt) + c2.slice(splitPt+1, cLen);
		return [newC1, newC2];
  }

  /** 
   *
   */
  function initChromosomes(chromosomes, L, features) {
    for (var i=0;i<L;i++){
      var chromosome = '';
      do {
	      for (var featureKey in features) {
	      	var feature = features[featureKey];
	        var v = Math.floor((Math.random()*feature.maxVal));
	        var vStr = v.toString(2);
	        // prepend zeros for bitfield size
	        while (vStr.length < feature.numBit) {
	        	vStr = '0'+vStr;
	        }
	        chromosome +=vStr;
	      }
			}while (!chromosomeValid(chromosome, features));
      chromosomes[i] = chromosome;
    }
  }
