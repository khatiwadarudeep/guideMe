import React, {Component} from 'react';
import Navbars from "../../../Navbars";
import Footer from "../../Footer/Footer";
import {Button, Card, Divider, Drawer, Tabs, Tag} from "antd";
import "./dashboard.css"
import Title from "antd/es/typography/Title";
import {database, randomIdGenerator} from "../../../../config";
import AdminCard from "./adminCard";
import firebase from "firebase";
import GuideActions from "./guideActions";

const {TabPane} = Tabs;

class Dashboard extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            guidesList: [],
            inquiresList: [],
            addNewTask: false
        }
    }

    componentDidMount() {
        this.getAllGuides();
        this.getAllQueries();
    }

    getAllQueries = () => {
        let inquires = [];
        this.setState({loading: true})
        database.collection('inquires').get().then((res) => {
            res.forEach(res => {
                inquires.push(res.data())
            })
            this.setState({loading: false, inquiresList: inquires})
        })
    }
    getAllGuides = () => {
        let guides = [];
        this.setState({loading: true})
        database.collection('guides').get().then((res) => {
            res.forEach(res => {
                console.log(res.data())
                guides.push(res.data())
            })
            this.setState({loading: false, guidesList: guides})
        })
    }
    handleAddGuide = (e) => {
        e.preventDefault();
        let randomId = randomIdGenerator();
        let database = firebase.firestore();
        let itemToAdd = this.state.guideAddItems;
        let obj = {
            id: randomId,
            task: itemToAdd.task,
            completed: false,
            dueDate: itemToAdd.dueDate,
            createdDate: Date.now(),
            color: itemToAdd.color || 'aliceblue',
            subTasks: itemToAdd.subTasks,

        }
        database.collection("guides").doc().set(obj)
            .then((res) => {
                this.getAllGuides();
                document.getElementById('add-task').reset();
                this.setState({addingNew: false})
            })
            .catch((error) => {
                console.log(error);

                console.error(error);
            });
        // addUser(inputRef.current['name'].value,inputRef.current['job'].value).then(r=>addedUser(r))
    }

    callback = (key) => {
        console.log(key);
    }
    checkBook=(msg)=>
    {
        if(msg)
        {
            return msg.includes('I would like to book')
        }
        else
        {
            return false
        }
    }
    render() {
        let {guidesList, addNewTask} = this.state;
        return (
            <div className="dashboard-wrap">
                <Title style={{margin: "1em 0"}}> Admin Dashboard</Title>
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="Guides" key="1">
                        <div className="flex-between">
                            <h3>Guides</h3>
                            <Button onClick={() => this.setState({addNewTask: true})}>Add Guide </Button>
                        </div>
                        <div className="guides-wrap">
                            {guidesList.map((guide) => <AdminCard guideEdited={()=>this.getAllGuides()} fromAdmin={true} onDelete={()=>this.getAllGuides()} guide={guide}/>)}
                        </div>
                    </TabPane>
                    <TabPane tab="Bookings and Inquiries" key="3">
                        <div style={{margin:"2em 0"}}>
                            {this.state.inquiresList.reverse().map((item)=>
                                <Card style={{borderColor:this.checkBook(item.message)?'orange':''}}>
                                    {this.checkBook(item.message)?<Tag color={"green"}>Booking request</Tag>:''}
                                    <div>
                                        <h3>Customer detail</h3>
                                        <div>{item.fName} {item.lName}</div>
                                        <div>{item.email}</div>
                                    </div>

                                    <div><b>Message</b>{item.message}</div>
                                </Card>
                            )
                            }
                        </div>

                    </TabPane>
                </Tabs>
                <Drawer
                    title="Add new guide"
                    placement={window.innerWidth < 700 ? "bottom" : "right"}
                    width={window.innerWidth > 700 ? "700px" : "100%"}
                    height={window.innerWidth > 700 ? "100%" : "95%"}
                    closable={true}
                    onClose={() => this.setState({addNewTask: false})}
                    visible={addNewTask}
                    key={"placement"}
                >
                    {addNewTask?<GuideActions addedGuide={(res) => {
                        this.getAllGuides()
                        this.setState({addNewTask: false})
                    }}/>:''}
                </Drawer>
            </div>
        );
    }
}

export default Dashboard;