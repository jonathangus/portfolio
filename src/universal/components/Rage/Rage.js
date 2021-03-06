import React, {Component, PropTypes} from 'react';

import styles from './Rage.css';

export default class Rage extends Component {

  constructor() {
    super();

    const gifs = [
      'https://media0.giphy.com/media/kHU8W94VS329y/giphy.gif',
      'https://media.giphy.com/media/D8kdCAJIoSQ6I/giphy.gif',
      'https://media.giphy.com/media/727vGbDHScnQI/giphy.gif',
      'https://media2.giphy.com/media/wwiviuAxBYsCc/giphy.gif',
      'https://media0.giphy.com/media/13EjnL7RwHmA2Q/giphy.gif',
      'https://media1.giphy.com/media/WzTvbHTKyERfG/giphy.gif',
      'https://media4.giphy.com/media/EmB4QtACPVBpS/giphy.gif',
      'http://www.abload.de/img/rage44qe39.gif',
      'http://i.imgur.com/Q4BEk.gif',
      'http://i.amz.mshcdn.com/FSQ1rjBoypcBezv8pM20TzROtP8=/fit-in/1200x9600/http%3A%2F%2Fmashable.com%2Fwp-content%2Fuploads%2F2013%2F06%2FTypewriter-throwing.gif'
    ]

    this.state = {
      selected: gifs[Math.floor(Math.random() * gifs.length) + 0]
    };
  }


  render () {

    return (
      <section style={{backgroundImage: `url(${this.state.selected})`}} className={styles.container}>
        <h1>404</h1>
      </section>
    );
  }
}
