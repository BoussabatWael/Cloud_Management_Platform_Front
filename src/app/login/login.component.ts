import { UsersPermissionsService } from './../Services/users-permissions.service';
import { UsersTokensService } from './../Services/users-tokens.service';
import { ApiKeysService } from './../Services/api-keys.service';
import { UsersSecurityService } from 'src/app/Services/users-security.service';
import { core_users_security } from './../models/core_users_security';
import { core_users } from './../models/core_users';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  userSecurity: core_users_security = new core_users_security();
  user: core_users = new core_users();
  apikey: any;
  userToken: any;
  userPermissions: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usersSercurityService: UsersSecurityService,
    private apiKeysService: ApiKeysService,
    private usersTokensService: UsersTokensService,
    private UsersPermissionsService: UsersPermissionsService
  ) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('user') === null) {
      this.router.navigateByUrl('');
    } else {
      this.router.navigateByUrl('index');
    }
  }

  get form() {
    return this.loginForm.controls;
  }

  decrypt(text: any) {
    let iv = CryptoJS.enc.Utf8.parse('BBBBBBBBBBBBBBBB');
    let key = 'AAAAAAAAAAAAAAAA';
    let k = CryptoJS.enc.Utf8.parse(key);
    let decrypted = CryptoJS.AES.decrypt(text, k, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
    });
    let dec = decrypted.toString(CryptoJS.enc.Utf8);
    return dec;
  }

  login() {
    if (this.loginForm.invalid || this.loginForm.value.length == 0) {
      this.submitted = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all informations!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    let data = this.loginForm.value;
    this.userSecurity.login = data.login;
    document.querySelector('.loginLoad')?.classList.remove('d-none');
    this.usersSercurityService.login(this.userSecurity.login).subscribe(
      (result) => {
        if (result.status == 200 && result.data !== null) {
          this.userSecurity = result.data;
          if (this.decrypt(result.data.password) == data.password) {
            this.user = this.userSecurity.user;
            this.apiKeysService.getOneApiKey(this.user.account.id).subscribe(
              (result1) => {
                if (result.status == 200 && result.data != null) {
                  this.apikey = result1.data.key_value;

                  this.usersTokensService
                    .getUserTokenByUserID(this.user.id)
                    .subscribe(
                      (result2) => {
                        if (result2.status == 200 && result2.data != null) {
                          this.userToken = result2.data.token;

                          this.UsersPermissionsService.getActiveUserPermissions(
                            this.user.id
                          ).subscribe(
                            (result3) => {
                              if (
                                result3.status == 200 &&
                                result3.data != null
                              ) {
                                this.userPermissions = JSON.parse(
                                  result3.data.code
                                );

                                localStorage.setItem(
                                  'user',
                                  JSON.stringify(this.user)
                                );
                                localStorage.setItem(
                                  'apikey',
                                  JSON.stringify(this.apikey)
                                );
                                localStorage.setItem(
                                  'token',
                                  JSON.stringify(this.userToken)
                                );
                                localStorage.setItem(
                                  'permissions',
                                  JSON.stringify(this.userPermissions)
                                );
                                document
                                  .querySelector('.loginLoad')
                                  ?.classList.add('d-none');
                                this.router.navigateByUrl('index');
                              } else {
                                document
                                  .querySelector('.loginLoad')
                                  ?.classList.add('d-none');
                                Swal.fire({
                                  title: 'Error!',
                                  text: 'Something went wrong!',
                                  icon: 'error',
                                  confirmButtonColor: '#2f49c7',
                                });
                              }
                            },
                            (error) => {
                              document
                                .querySelector('.loginLoad')
                                ?.classList.add('d-none');
                              Swal.fire({
                                title: 'Error!',
                                text: 'Something went wrong!',
                                icon: 'error',
                                confirmButtonColor: '#2f49c7',
                              });
                            }
                          );
                        } else {
                          document
                            .querySelector('.loginLoad')
                            ?.classList.add('d-none');
                          Swal.fire({
                            title: 'Error!',
                            text: 'User token NOT found!',
                            icon: 'error',
                            confirmButtonColor: '#2f49c7',
                          });
                        }
                      },
                      (error) => {
                        document
                          .querySelector('.loginLoad')
                          ?.classList.add('d-none');
                        Swal.fire({
                          title: 'Error!',
                          text: 'Something went wrong!',
                          icon: 'error',
                          confirmButtonColor: '#2f49c7',
                        });
                      }
                    );
                } else {
                  document.querySelector('.loginLoad')?.classList.add('d-none');
                  Swal.fire({
                    title: 'Error!',
                    text: 'Invalid api key!',
                    icon: 'error',
                    confirmButtonColor: '#2f49c7',
                  });
                }
              },
              (error) => {
                document.querySelector('.loginLoad')?.classList.add('d-none');
                Swal.fire({
                  title: 'Error!',
                  text: 'Something went wrong!',
                  icon: 'error',
                  confirmButtonColor: '#2f49c7',
                });
              }
            );
          } else {
            document.querySelector('.loginLoad')?.classList.add('d-none');
            Swal.fire({
              title: 'Error!',
              text: 'Invalid credentials!',
              icon: 'error',
              confirmButtonColor: '#2f49c7',
            });
          }
        } else {
          document.querySelector('.loginLoad')?.classList.add('d-none');
          Swal.fire({
            title: 'Error!',
            text: 'User does not exist!',
            icon: 'error',
            confirmButtonColor: '#2f49c7',
          });
        }
      },
      (error) => {
        document.querySelector('.loginLoad')?.classList.add('d-none');
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }
}
