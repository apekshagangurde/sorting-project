import ApexCharts from 'react-apexcharts';
import { FaPlay, FaPause, FaStop } from 'react-icons/fa';

import React, { Component } from 'react';
class SortingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      array: this.generateRandomArray(10, 5, 100),
      options: {
        chart: {
          type: 'bar',
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            endingShape: 'rounded',
            dataLabels: {
              position: 'top',
            },
          },
        },
        xaxis: {
          categories: [],
        },
      },
      series: [
        {
          name: 'Array',
          data: [],
        },
      ],
      isSorting: false,
      isPaused: false,
    };
    this.sortTimeout = null;
  }

  async quickSort() {
    this.setState({ isSorting: true });
    const array = [...this.state.array];
    await this.quickSortHelper(array, 0, array.length - 1);
    this.setState({ isSorting: false });
    this.showSortedState();
  }

  async quickSortHelper(arr, low, high) {
    if (low < high) {
      const pivotIndex = await this.partition(arr, low, high);
      await this.quickSortHelper(arr, low, pivotIndex - 1);
      await this.quickSortHelper(arr, pivotIndex + 1, high);
    }
  }

  async partition(arr, low, high) {
    const pivot = arr[low]; // Use the first element as the pivot
    let i = low;
    for (let j = low + 1; j <= high; j++) {
      if (arr[j] < pivot) {
        i++;
        await this.swap(arr, i, j);
      }
    }
    await this.swap(arr, low, i);
    return i;
  }

  async swap(arr, a, b) {
    if (!this.state.isPaused) {
      await this.sleep(150); // Delay for visualization
      const temp = arr[a];
      arr[a] = arr[b];
      arr[b] = temp;

      const categories = arr.map((_, index) => (index + 1).toString());
      const series = [{ data: arr }];

      this.setState({
        array: arr,
        options: {
          xaxis: {
            categories,
          },
        },
        series,
      });
    }
  }

  showSortedState() {
    // Implement a way to visually indicate that the array is sorted using colors.
    const sortedArray = this.state.array.slice().sort((a, b) => a - b);
    const categories = sortedArray.map((_, index) => (index + 1).toString());
    const series = [{ data: sortedArray }];

    this.setState({
      options: {
        xaxis: {
          categories,
        },
        fill: {
          colors: ['#66BB6A'], // You can use any color you like
        },
      },
      series,
    });
  }

  startSorting() {
    if (!this.state.isSorting) {
      this.setState({ isPaused: false });
      this.quickSort();
    }
  }

  pauseSorting() {
    this.setState({ isPaused: true });
  }

  stopSorting() {
    this.setState({ isSorting: false, isPaused: false });
    clearTimeout(this.sortTimeout);
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  generateRandomArray(length, min, max) {
    const array = [];
    for (let i = 0; i < length; i++) {
      array.push(this.randomIntFromInterval(min, max));
    }
    return array;
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  render() {
    const { options, series, isSorting, isPaused } = this.state;

    return (
      <div className="sorting-visualizer">
        <h2>Quick Sort Visualization</h2>
        <div className="chart-container">
          <ApexCharts options={options} series={series} type="bar" height={400} />
        </div>
        <div className="controls">
          <button
            onClick={() => this.startSorting()}
            disabled={isSorting}
            className="control-button"
          >
            <FaPlay /> Start Quick Sort
          </button>
          <button
            onClick={() => this.pauseSorting()}
            disabled={!isSorting || isPaused}
            className="control-button"
          >
            <FaPause /> Pause Quick Sort
          </button>
          <button
            onClick={() => this.stopSorting()}
            className="control-button"
          >
            <FaStop /> Stop Quick Sort
          </button>
        </div>
      </div>
    );
  }
}

export default SortingVisualizer;