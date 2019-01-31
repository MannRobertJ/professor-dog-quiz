import React, { Component } from "react";
import DogQuiz from "./DogQuiz.js";
import {
  getDogs,
  getRandomDogsAndPhoto,
  sendAvailableDogs,
  increaseLevel
} from "../actions/dogs";
import { connect } from "react-redux";

class DogQuizContainer extends Component {
  state = { loading: true };

  componentDidMount = () => {
    this.props.getDogs();
  };

  componentDidUpdate = prevProps => {
    if (this.props.turn === 0 && this.props.dogs !== prevProps.dogs) {
      this.increaseAvailable([], Object.keys(this.props.dogs), 3);
    }
    if (
      this.props.currentStreak > prevProps.currentStreak &&
      this.props.currentStreak % 2 === 0 &&
      this.props.currentStreak > 0
    ) {
      this.increaseAvailable(
        this.props.availableDogs.available,
        this.props.availableDogs.unused,
        3
      );
      this.props.increaseLevel();
    }
    if (
      this.props.turn !== prevProps.turn ||
      this.props.availableDogs !== prevProps.availableDogs
    ) {
      this.props.getRandomDogsAndPhoto({
        ...this.props.availableDogs.available
      });
    }
  };

  increaseAvailable(available, unused, n) {
    if (n === 0) {
      this.props.sendAvailableDogs({
        available: available,
        unused: unused
      });
    } else {
      const index = Math.floor(Math.random() * unused.length);
      const element = unused[index];
      const availableCopy = [...available];
      const unusedCopy = [...unused];
      availableCopy.push(element);
      unusedCopy.splice(index, 1);
      this.increaseAvailable(availableCopy, unusedCopy, n - 1);
    }
  }

  render() {
    if (!this.props.image) return "Loading photos...";
    return (
      <DogQuiz
        image={this.props.image}
        dogs={this.props.dogs}
        hardmode={this.props.hardmode}
      />
    );
  }
}

const mapStateToProps = state => ({
  dogs: state.dogs,
  image: state.images,
  turn: state.successRate.CORRECT + state.successRate.WRONG,
  currentStreak: state.currentStreak,
  availableDogs: state.availableDogs,
  level: state.level,
  hardmode: state.hardmode
});

export default connect(
  mapStateToProps,
  { getDogs, getRandomDogsAndPhoto, sendAvailableDogs, increaseLevel }
)(DogQuizContainer);
