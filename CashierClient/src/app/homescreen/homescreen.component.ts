import { Component, OnInit } from '@angular/core';
import Chatkit from '@pusher/chatkit-client';
import axios from 'axios';


@Component({
  selector: 'app-homescreen',
  templateUrl: './homescreen.component.html',
  styleUrls: ['./homescreen.component.css']
})
export class HomescreenComponent implements OnInit {
  title = 'Angular Chatroom';
      messages = [];
      users = [];
      currentUser: any;

      _username = '';
      get username(): string {
        return this._username;
      }
      set username(value: string) {
        this._username = value;
      }

      _message = '';
      get message(): string {
        return this._message;
      }
      set message(value: string) {
        this._message = value;
      }

      sendMessage() {
        const { message, currentUser } = this;
        currentUser.sendMessage({
          text: message,
          roomId: '19736362',
        });
        this.message = '';
      }

      addUser() {
        const { username } = this;
        axios.post('http://localhost:5200/users', { username })
          .then(() => {
            const tokenProvider = new Chatkit.TokenProvider({
              url: 'http://localhost:5200/authenticate'
            });

            const chatManager = new Chatkit.ChatManager({
              instanceLocator: 'v1:us1:502534d0-1665-40d6-bd14-dbae511536c2',
              userId: username,
              tokenProvider
            });

            return chatManager
              .connect()
              .then(currentUser => {
                currentUser.subscribeToRoom({
                  roomId: '19736362',
                  messageLimit: 100,
                  hooks: {
                    onMessage: message => {
                      this.messages.push(message);
                    },
                    onPresenceChanged: (state, user) => {
                      this.users = currentUser.users.sort((a, b) => {
                        if (a.presence.state === 'online') { return -1; }

                        return 1;
                      });
                    },
                  },
                });

                this.currentUser = currentUser;
                this.users = currentUser.users;
              });
          })
            .catch(error => console.error(error));
      }

  constructor() {
  }

  ngOnInit() {

  }

}
