import { View } from "react-native"
import Event from "../components/Event"
import MenuPanel from "../components/MenuPanel";

const EventScreen = () => {
    return (
        <View style={styles.container}>
            <Event />
            <View style={styles.menu}>
                <MenuPanel />
            </View>
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    },
    menu: {
        position: 'absolute',
        width: "100%",
        bottom: 0
    }
}

export default EventScreen;