 import React, {Component} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

const superheroes = [
  {
    backgroundColor: '#CC1C2A',
    key: 'spiderman',
    header: 'spider\nman',
    imgSrc: require('./img/spiderman.png'),
    movieImgSrc: [require('./img/spider-man-movie-1.jpg'), require('./img/spider-man-movie-2.jpg')],
    style: { height: 300, width: 329 },
    name: 'peter parker',
    bodyText: 'In Forest Hills, Queens, New York, Midtown High School student Peter Benjamin Parker is a science-whiz orphan living with his Uncle Ben and Aunt May. He is bitten by a radioactive spider at a science exhibit and acquires the agility and proportionate strength of an arachnid.',
  },
  {
    backgroundColor: '#DA9403',
    key: 'ironman',
    imgSrc: require('./img/iron-man.png'),
    style: { height: 350, width: 350 },
    movieImgSrc: [require('./img/iron-man-movie-1.jpg'), require('./img/iron-man-movie-2.jpg')],
    header: 'iron\nman',
    name: 'tony stark',
    bodyText: 'Anthony Edward Stark is the son of wealthy industrialist and head of Stark Industries, Howard Stark, and Maria Stark. A boy genius, he enters MIT at the age of 15 to study engineering and later receives master\'s degrees in engineering and physics. After his parents are killed in a car accident, he inherits his father\'s company.',
  },
  {
    backgroundColor: '#000000',
    key: 'black-widow',
    imgSrc: require('./img/black-widow.png'),
    style: { height: 300, width: 222 },
    movieImgSrc: [require('./img/black-widow-movie-1.jpg'), require('./img/black-widow-movie-2.jpg')],
    header: 'black\nwidow',
    name: 'natasha romanova',
    bodyText: 'Natasha was born in Stalingrad (now Volgograd), Russia. The first and best-known Black Widow is a Russian agent trained as a spy, martial artist, and sniper, and outfitted with an arsenal of high-tech weaponry, including a pair of wrist-mounted energy weapons dubbed her "Widow\'s Bite".',
  },
  {
    backgroundColor: '#00579B',
    key: 'captain-america',
    imgSrc: require('./img/captain-america.png'),
    style: { height: 300, width: 222 },
    movieImgSrc: [require('./img/captain-america-movie-1.jpg'), require('./img/captain-america-movie-2.jpg')],
    header: 'captain\namerica',
    name: 'steve rogers',
    bodyText: 'Steven Rogers was born in the Lower East Side of Manhattan, New York City, in 1920 to poor Irish immigrants, Sarah and Joseph Rogers. Joseph died when Steve was a child, and Sarah died of pneumonia while Steve was a teen. By early 1940, before America\'s entry into World War II, Rogers is a tall, scrawny fine arts student specializing in illustration and a comic book writer and artist.',
  },
  {
    backgroundColor: '#660C1D',
    key: 'scarlet-witch',
    imgSrc: require('./img/scarlet-witch.png'),
    style: { height: 300, width: 163 },
    movieImgSrc: [require('./img/scarlet-witch-movie-1.jpg'), require('./img/scarlet-witch-movie-2.jpg')],
    header: 'scarlet\nwitch',
    name: 'wanda maximoff',
    bodyText: 'Magda, the wife of Magneto, escapes from him while pregnant and takes sanctuary at Mount Wundagore in Transia, the home of the High Evolutionary. She gave birth to twins, Wanda and Pietro. The Elder God Chthon altered Wanda at birth and gave her the ability to use magic in addition to her mutant abilities, planning to use her as a vessel when her powers reached maturity.',
  },
  {
    backgroundColor: '#333333',
    key: 'black-panther',
    imgSrc: require('./img/black-panther.png'),
    style: { height: 300, width: 237 },
    movieImgSrc: [require('./img/black-panther-movie-1.jpg'), require('./img/black-panther-movie-2.jpg')],
    header: 'black\npanther',
    name: 'king t\'challa',
    bodyText: 'The Black Panther is the ceremonial title given to the chief of the Panther Tribe of the advanced African nation of Wakanda. In addition to ruling the country, he is also chief of its various tribes (collectively referred to as the Wakandas). The Panther habit is a symbol of office (head of state) and is used even during diplomatic missions.',
  },
  {
    backgroundColor: '#908548',
    key: 'hulk',
    imgSrc: require('./img/hulk.png'),
    style: { height: 300, width: 348 },
    movieImgSrc: [require('./img/hulk-movie-1.jpeg'), require('./img/hulk-movie-2.jpg')],
    header: 'the\nhulk',
    name: 'bruce banner',
    bodyText: 'During the experimental detonation of a gamma bomb, scientist Robert Bruce Banner saves teenager Rick Jones who has driven onto the testing field; Banner pushes Jones into a trench to save him, but is hit with the blast, absorbing massive amounts of gamma radiation. He awakens later seemingly unscathed, but that night transforms into a lumbering grey form.',
  },
];

const MAX_CARDS_DISPLAYED = 4;
const ADVANCE_THRESHOLD = 0.2; // % of screen swipe horizontal
const GESTURE_STATES = [
  'UNDETERMINED',
  'FAILED',
  'BEGAN',
  'CANCELLED',
  'ACTIVE',
  'END',
];

export default class App extends Component {

  slideUp = new Animated.Value(0);
  slideUpValue = 0;
  slideUpImage = new Animated.Value(0);
  slideUpHeader = new Animated.Value(0);
  slideUpName = new Animated.Value(0);
  slideUpPhaseTwo = new Animated.Value(0);
  slideUpBody = new Animated.Value(0);
  slideUpMoviesHeader = new Animated.Value(0);
  slideUpMovies0 = new Animated.Value(0);
  slideUpMovies1 = new Animated.Value(0);
  progress = new Animated.Value(0);
  progressValue = 0;
  progressPreviousValue = 0;
  screenWidth = Dimensions.get('window').width;
  screenHeight = Dimensions.get('window').height;

  state = {
    activeIndex: 0,
  };

  componentDidMount() {
    this.progress.addListener(({value}) => this.progressValue = value);
    this.slideUp.addListener(({value}) => this.slideUpValue = value);
  }

  onGestureEvent = e => {
    if (this.slideUpValue > 0) {
      return;
    }

    const { translationX } = e.nativeEvent;
    const adjustedX = -translationX / this.screenWidth;
    const newValue = Math.max(0, Math.min(superheroes.length - 1, this.progressPreviousValue + adjustedX));
    this.progress.setValue(newValue);
  }

  onHandlerStateChange = e => {
    if (this.slideUpValue > 0) {
      return;
    }

    const { state } = e.nativeEvent;
    if (GESTURE_STATES[state] === 'END') {
      this.finishSwipe();
    }
  }

  finishSwipe() {
    const swipeDiff = this.progressValue - this.progressPreviousValue;
    const direction = swipeDiff < 0 ? 'right' : 'left';
    let toValue = direction === 'left' ? Math.floor(this.progressPreviousValue) : Math.ceil(this.progressPreviousValue); 
    if (Math.abs(swipeDiff) > ADVANCE_THRESHOLD) {
      toValue = direction === 'left' ? Math.ceil(this.progressValue) : Math.floor(this.progressValue); 
    }
    Animated.timing(
      this.progress,
      {
        toValue,
        duration: 150,
      }
    ).start(() => {
      this.progressPreviousValue = toValue;
      this.setState({ activeIndex: toValue });
    });
  }

  getSpringAnimations(animatedValKeys, toValue) {
    return animatedValKeys.map(key => Animated.spring(this[key], { toValue, speed: 5 }));
  }
  
  onKnowMoreTextPress = () => {
    Animated.stagger(1000, [
      Animated.stagger(300, [
        Animated.stagger(100, this.getSpringAnimations(['slideUp', 'slideUpImage'], 1)),
        Animated.stagger(100, this.getSpringAnimations(['slideUpHeader', 'slideUpName'], 1)),
      ]),
      Animated.stagger(100, [
        Animated.timing(this.slideUpPhaseTwo, { toValue: 1, duration: 500, easing: Easing.out(Easing.linear) }),
        ...this.getSpringAnimations(['slideUpBody', 'slideUpMoviesHeader', 'slideUpMovies0', 'slideUpMovies1'], 1),
      ])
    ]).start();
  }

  onBackArrowPress = () => {
    const animations = this.getSpringAnimations([
      'slideUpMovies1',
      'slideUpMovies0',
      'slideUpMoviesHeader',
      'slideUpBody',
      'slideUpPhaseTwo',
      'slideUpName',
      'slideUpHeader',
      'slideUpImage',
      'slideUp'
    ], 0);
    Animated.stagger(50, animations).start();
  }

  getStyleForHeroImageAtIndex(hero, index) {
    const opacityInputRange = Array(superheroes.length).fill().map((_, i) => i);
    const opacityOutputRange = Array(superheroes.length).fill().map((_, i) => {
      if (i > index) {
        return 0;
      } else if (i === index) {
        return 1;
      } else {
        return 0.3;
      }
    });

    return [
      {
        opacity: this.progress.interpolate({
          inputRange: opacityInputRange,
          outputRange: opacityOutputRange,
          extrapolate: 'clamp',
        }),
        top: this.progress.interpolate({
          inputRange: [index - 0.5, index, index + 0.1, index + 0.6],
          outputRange: [-50, -125, -125, -50],
          extrapolate: 'clamp',
        }),
        transform: [
          {
            scale: this.progress.interpolate({
              inputRange: [index - 0.5, index, index + 0.1, index + 0.4],
              outputRange: [0.3, 1, 1, 0.3],
              extrapolate: 'clamp',
            }),
          },
          {
            translateY: this.state.activeIndex === index  ?
            this.slideUpImage.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -125],
            }) : 0
          },
        ]
      }
    ];
  }

  getStyleForCardAtIndex(hero, index) {
    const opacityInputRange = Array(superheroes.length).fill().map((_, i) => i);
    const opacityOutputRange = Array(superheroes.length).fill().map((_, i) => {
      if (i > index) {
        return 0;
      } else if (i === index) {
        return 1;
      } else {
        return Math.max(0, (i - (index - MAX_CARDS_DISPLAYED))) / 50;
      }
    });
    
    return [
      {
        opacity: this.progress.interpolate({
          inputRange: opacityInputRange,
          outputRange: opacityOutputRange,
        }),
      },
      {
        transform: [
          { 
            scale: this.progress.interpolate({
              inputRange: [index - 1, index],
              outputRange: [0.95, 1]
            }),
          },
          { 
            translateY:
            this.progress.interpolate({
              inputRange: [index - 1, index],
              outputRange: [this.screenHeight * 0.3, this.screenHeight * 0.335],
            })
          },
          { 
            translateX: this.progress.interpolate({
              inputRange: [index, index+1],
              outputRange: [0, -200],
              extrapolate: 'clamp',
            }),
          },
          { 
            rotate: this.progress.interpolate({
              inputRange: [index, index + 0.25],
              outputRange: ['0deg', '-15deg'],
              extrapolate: 'clamp',
            }),
          },
        ],
      }
    ];
  }

  render() {
    return (
      <View style={styles.container}>
        {
          superheroes.map((hero, index) => {
            const isActiveCard = this.state.activeIndex === index;
            return (
              <PanGestureHandler
                key={hero.key}
                onGestureEvent={this.onGestureEvent}
                onHandlerStateChange={this.onHandlerStateChange}
              >
                <Animated.View
                  pointerEvents={isActiveCard ? 'auto' : 'none'}
                  zIndex={superheroes.length - index}
                  style={[
                    styles.card,
                    ...this.getStyleForCardAtIndex(hero, index),
                  ]}
                >
                  <Animated.View
                    style={[
                      StyleSheet.absoluteFillObject,
                      styles.backgroundContainer,
                      {
                        backgroundColor: '#FFFFFF',
                        transform: [
                            {
                              translateY: isActiveCard ?
                                this.slideUp.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0, -300],
                                }) : 0,
                            },
                        ],
                      }
                    ]}
                  >
                    <Animated.View
                      style={[
                        StyleSheet.absoluteFillObject,
                        styles.innerBackgroundContainer,
                        {
                          bottom: isActiveCard ?
                            this.slideUpPhaseTwo.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-700, this.screenHeight],
                            }) : 0,
                          transform: [
                              {
                                translateY: isActiveCard ?
                                  this.slideUp.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -300],
                                  }) : 0,
                              },
                          ],
                        }
                      ]}
                    >
                      <LinearGradient
                        colors={[hero.backgroundColor, '#FFFFFF']}
                        style={[styles.innerBackgroundContainer, styles.flexOne]}
                        start={{x: 0, y: 0.75}} end={{x: 0, y: 1}}
                      />
                      <Animated.View
                        style={[
                          StyleSheet.absoluteFillObject,
                          styles.innerBackgroundContainer,
                          {
                            backgroundColor: this.progress.interpolate({
                              inputRange: [index - 1,  index],
                              outputRange: ['#000000', 'transparent'],
                            }),
                          }
                        ]}
                      />
                    </Animated.View>
                  </Animated.View>
                  <View style={styles.paddedContainer}>
                    <Animated.Image
                      source={hero.imgSrc}
                      style={[
                        styles.heroImage,
                        hero.style,
                        ...this.getStyleForHeroImageAtIndex(hero, index),
                      ]}
                    />
                    <Animated.Text
                      style={[
                        styles.heroHeaderText,
                        {
                          color: isActiveCard ?
                            this.slideUpPhaseTwo.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['#FFFFFF', '#000000'],
                            }) : '#FFFFFF',
                          transform: [
                            {
                              translateY: isActiveCard ?
                                this.slideUpHeader.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0, -150],
                                }) : 0,
                            },
                          ],
                        },
                      ]}
                    >
                      {hero.header}
                    </Animated.Text>
                    <Animated.View
                      style={[
                        styles.nameRow,
                        {
                          transform: [
                            {
                              translateY: isActiveCard ?
                                this.slideUpName.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0, -150],
                                }) : 0,
                            },
                          ],
                        },
                      ]}
                    >
                      <Animated.Text
                        style={[
                          styles.subHeaderText,
                          {
                            color: isActiveCard ?
                              this.slideUpPhaseTwo.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['#FFFFFF', '#000000'],
                              }) : '#FFFFFF'
                          }
                        ]}
                      >
                        {hero.name}
                      </Animated.Text>
                      <Animated.Image
                        source={require('./img/marvel-logo.png')}
                        style={[
                          styles.marvelLogo,
                          {
                            opacity: isActiveCard ?
                              this.slideUpBody.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1],
                              }) : 0,
                            transform: [
                              {
                                scale: isActiveCard ?
                                  this.slideUpBody.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 1],
                                  }) : 0
                              },
                            ],
                          },
                        ]}
                      />
                    </Animated.View>
                    <Animated.View
                      style={[
                        styles.knowMoreContainer,
                        {
                          opacity: isActiveCard ?
                            this.slideUp.interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 0],
                            }) : 1,
                          transform: [
                            {
                              translateX: isActiveCard ?
                                this.slideUp.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0, 50],
                                }) : 0,
                            },
                          ],
                        },
                      ]}
                    >
                      <TouchableOpacity activeOpacity={0.8} onPress={this.onKnowMoreTextPress}>
                        <Text style={styles.knowMoreText}>
                          know more ⟶
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                    <Animated.View
                      style={[
                        styles.bodyTextContainer,
                        {
                          opacity: isActiveCard ?
                            this.slideUpBody.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 1],
                            }) : 0,
                          transform: [
                            {
                              translateY: isActiveCard ?
                                this.slideUpBody.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0, -170],
                                }) : 0,
                            }
                          ]
                        }
                      ]}
                    >
                      <Text style={styles.bodyText}>
                        {hero.bodyText.slice(0, 170)}
                        ...
                        <Text style={{ color: hero.backgroundColor }}>
                          {' see more'}
                        </Text>
                      </Text>
                    </Animated.View>
                    <Animated.Text
                      style={[
                        styles.subHeaderText,
                        {
                          opacity: isActiveCard ?
                            this.slideUpMoviesHeader.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 1],
                            }) : 0,
                          transform: [
                            {
                              translateY: isActiveCard ?
                                this.slideUpMoviesHeader.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0, -170],
                                }) : 0,
                            },
                          ],
                        }
                      ]}
                    >
                      movies
                    </Animated.Text>
                    <View style={styles.moviesContainer}>
                      {[0, 1].map(n => (
                        <Animated.Image
                          key={n}
                          source={hero.movieImgSrc[n]}
                          style={[
                            styles.movieImage,
                            {
                              opacity: isActiveCard ?
                                this[`slideUpMovies${n}`].interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0, 1],
                                }) : 0,
                              transform: [
                                {
                                  translateY: isActiveCard ?
                                    this[`slideUpMovies${n}`].interpolate({
                                      inputRange: [0, 1],
                                      outputRange: [0, -170],
                                    }) : 0,
                                },
                              ],
                            }
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                </Animated.View>
              </PanGestureHandler>
            )
          })
        }
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={this.onBackArrowPress}
            style={styles.backArrowContainer}
          >
            <Image source={require('./img/back.png')} />
          </TouchableOpacity>
          <Animated.Text
            style={[
              styles.moviesHeaderText,
              {
                transform: [
                  {
                    translateY: this.slideUp.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -100],
                    }),
                  },
                ],
              },
            ]}
          >
            movies
          </Animated.Text>
          <View style={styles.dummy} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flexOne: {
    flex: 1,
  },
  backgroundContainer: {
    borderRadius: 40,
  },
  innerBackgroundContainer: {
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  navBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 60,
    left: 25,
    right: 25,
    zIndex: 100,
  },
  backArrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
  },
  moviesHeaderText: {
    fontFamily: 'Avenir-Book',
    fontSize: 36,
    letterSpacing: 1.8,
  },
  dummy: {
    width: 50,
  },
  card: {
    borderRadius: 40,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  heroImage: { 
    alignSelf: 'center',
    position: 'absolute',
  },
  paddedContainer: {
    flex: 1,
    paddingTop: 200,
    paddingHorizontal: 40,
  },
  heroHeaderText: {
    color: '#FFFFFF',
    fontSize: 70,
    fontFamily: 'Avenir-Black',
    lineHeight: 76,
  },
  subHeaderText: {
    fontFamily: 'Avenir-Heavy',
    fontSize: 28,
  },
  knowMoreContainer: {
    marginTop: 20,
  },
  knowMoreText: {
    color: '#FFB23E',
    fontFamily: 'Avenir-Heavy',
    fontSize: 22,
    letterSpacing: 1.8,
  },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  marvelLogo: {
    height: 25,
    left: -20,
    width: 68,
  },
  bodyTextContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.2)',
    paddingVertical: 15,
    marginBottom: 15,
  },
  bodyText: {
    fontFamily: 'Avenir-Light',
    fontSize: 16,
    lineHeight: 32,
  },
  moviesContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  movieImage: {
    borderRadius: 15,
    height: 250,
    width: ((Dimensions.get('window').width - 80) / 2) - 15,
  }
});
