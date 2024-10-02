class GeneticAlgorithm {
  #canvasSize;
  #queensNumber;
  maxFitness;
  #populationSize;
  #mutationRate;
  generationNumber = 0;
  currentGeneration = [];

  constructor(queensNumber, populationSize, mutationRate, canvasSize) {
    this.#queensNumber = queensNumber;
    this.#populationSize = populationSize;
    this.#mutationRate = mutationRate;
    this.#canvasSize = canvasSize;

    this.#calculateMaxFitness();
    this.#generateInitialPopulation();
  }

  #generateInitialPopulation() {
    const numberOfCells = Math.pow(this.#canvasSize, 2);

    for (let i = 0; i < this.#populationSize; i++) {
      const queensPosition = [];

      while (queensPosition.length < this.#queensNumber) {
        const position = Math.floor(Math.random() * numberOfCells);
        if (!queensPosition.includes(position)) queensPosition.push(position);
      }

      this.currentGeneration.push({
        positions: queensPosition,
        fitness: this.#calculateFitness(queensPosition)
      });
    }

    this.#sortCurrentGenerationByFitness();
    this.generationNumber++;
  }

  #calculateFitness(positions) {
    let fitness = this.maxFitness;

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const row1 = Math.floor(positions[i] / this.#canvasSize);
        const col1 = positions[i] % this.#canvasSize;

        const row2 = Math.floor(positions[j] / this.#canvasSize);
        const col2 = positions[j] % this.#canvasSize;

        if (row1 === row2 || col1 === col2 || Math.abs(row1 - row2) === Math.abs(col1 - col2)) {
          fitness--;
        }
      }
    }

    return fitness;
  }

  #sortCurrentGenerationByFitness() {
    this.currentGeneration.sort((a, b) => b.fitness - a.fitness);
  }

  #calculateMaxFitness() {
    this.maxFitness = (this.#queensNumber * (this.#queensNumber - 1)) / 2;
  }

  #mutateChromosome(chromosome) {
    if (Math.random() < this.#mutationRate) {
      const randomPositionIdx = Math.floor(Math.random() * chromosome.positions.length);
      const numberOfCells = Math.pow(this.#canvasSize, 2);
      let newPosition;

      do {
        newPosition = Math.floor(Math.random() * numberOfCells);
      } while (chromosome.positions.includes(newPosition));

      chromosome.positions[randomPositionIdx] = newPosition;
    }
  }

  #crossover(healthiestChromosomes) {
    const chromosome = {
      positions: []
    };

    while (chromosome.positions.length < this.#queensNumber) {
      const randomChromosomeIdx = Math.floor(Math.random() * healthiestChromosomes.length);
      const randomQueenIdx = Math.floor(Math.random() * this.#queensNumber);
      const position = healthiestChromosomes[randomChromosomeIdx].positions[randomQueenIdx];
      
      if (!chromosome.positions.includes(position)) chromosome.positions.push(position);
    }

    return chromosome;
  }

  breedNewGeneration() {
    const healthiestChromosomes = this.currentGeneration.slice(0, Math.floor(this.#populationSize / 2));
    const nextGeneration = [];

    while (nextGeneration.length < this.#populationSize) {
      const chromosome = this.#crossover(healthiestChromosomes);

      this.#mutateChromosome(chromosome);

      chromosome.fitness = this.#calculateFitness(chromosome.positions);
      nextGeneration.push(chromosome);
    }

    this.currentGeneration = nextGeneration;
    this.#sortCurrentGenerationByFitness();
    this.generationNumber++;
  }
}

export { GeneticAlgorithm };