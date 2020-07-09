import React from 'react'
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions, Picker, Platform, Vibration } from 'react-native'
import Sound from 'react-native-sound'

export default class App extends React.Component {
    state = {
        remainingSeconds: 0,
        isRunning: false,
        isPaused: false,
        selectedMinutes: '0',
        selectedSeconds: '0'
    }

    interval = null;

    componentDidUpdate(prevProp, prevState) {
        if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0) {
            tada.play()
            Vibration.vibrate()
            this.stop()
        }
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval)
        }
    }

    start = () => {
        this.setState(state => ({
            remainingSeconds: parseInt(state.selectedMinutes, 10) * 60 + parseInt(state.selectedSeconds),
            isRunning: true,
    }))

    this.interval = setInterval(() => {
        if (this.state.isPaused){
            this.setState(state => ({ remainingSeconds: state.remainingSeconds }))
        } else {
            this.setState(state => ({ remainingSeconds: state.remainingSeconds - 1 }))    
        }
        }, 1000)
    }

    stop = () => {
        clearInterval(this.interval);
        this.interval = null;
        this.setState({ remainingSeconds: 0, isRunning: false })
    }

    pause = () => {
        if (this.state.isPaused) {
            this.setState({ isPaused: false })
        } else {
            this.setState({ isPaused: true })
        }
    }

    renderPickers = () => {
        return (
            <View style={styles.pickerContainer}>
                <Picker 
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                    selectedValue={this.state.selectedMinutes}
                    onValueChange={ itemValue => {
                        this.setState({ selectedMinutes: itemValue })
                    }}
                    mode='dropdown'>
                    {AVAILABLE_MINUTES.map(value => (
                        <Picker.Item key={value} label={value} value={value} />
                    ))}
                </Picker>
                <Text style={styles.pickerItem}>minutes</Text>
                <Picker 
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                    selectedValue={this.state.selectedSeconds}
                    onValueChange={ itemValue => {
                        this.setState({ selectedSeconds: itemValue })
                    }}
                    mode='dropdown'>
                    {AVAILABLE_SECONDS.map(value => (
                        <Picker.Item key={value} label={value} value={value}/>
                    ))}
                </Picker>
                <Text style={styles.pickerItem}>seconds</Text>
            </View>
        )
    }

    render(){
        const { minutes, seconds } = getRemaining(this.state.remainingSeconds)
        return (
            <View style={styles.container}>
                <StatusBar barStyle='light-content'/>
                {this.state.isRunning ? (
                    <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
                ) : ( this.renderPickers() ) }
                {this.state.isRunning ? (
                    <View style={styles.pickerContainer}>
                        <TouchableOpacity onPress={this.stop} style={[styles.button, styles.buttonStop]}>
                            <Text style={[styles.buttonText, styles.buttonTextStop]}>Reset</Text>
                        </TouchableOpacity> 
                        <TouchableOpacity onPress={this.pause} style={[styles.button, styles.buttonPause]}>
                            <Text style={[styles.buttonText, styles.buttonTextPause]}>Pause</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity onPress={this.start} style={styles.button}>
                        <Text style={styles.buttonText}>Start</Text>
                    </TouchableOpacity>
                )}
          </View>
        );
    }
}

const tada = new Sound(require('../assets/tada.wav'), null, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return
    }
})

const createArray = length => {
    const arr = []
    let i = 0 
    while (i < length) {
        arr.push(i.toString())
        i += 1 
    } 
    return arr
}

const AVAILABLE_MINUTES = createArray(10)
const AVAILABLE_SECONDS = createArray(60)

const getRemaining = time => {
    const minutes = Math.floor(time/60)
    const seconds = time - minutes * 60
    return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) }
}

const formatNumber = number => `0${number}`.slice(-2)

const screen = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#07121B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        borderWidth: 10,
        borderColor: '#00AB66',
        width: screen.width / 2,
        height: screen.width / 2,
        borderRadius: screen.width / 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    buttonStop: {
        borderColor: "#FF6347",
        width: screen.width / 2.5,
        height: screen.width / 2.5,
        margin: 3
    },
    buttonPause: {
        borderColor: "#FFD300",
        width: screen.width / 2.5,
        height: screen.width / 2.5,
        margin: 3
    },
    buttonText: {
        fontSize: 45,
        color: '#00AB66',
    },
    buttonTextStop: {
        color: "#FF6347"
    },
    buttonTextPause: {
        color: "#FFD300"
    },
    timerText: {
        color: '#FFF',
        fontSize: 90,
    },
    picker: {
        width: 50,
        ...Platform.select({
            android: {
                color: '#fff',
                backgroundColor: '#07121B'
            }
        })

    },
    pickerItem: {
        color: '#fff',
        fontSize: 20
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: "center",
    }
});
