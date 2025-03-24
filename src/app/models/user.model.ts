export class User {
  email?: string;
  password?: string;

  constructor(email?: string, password?: string) {
    this.email = email;
    this.password = password;
  }
}

export class UserData {
  id: number;
  member_employee_id: string;
  member_firstname: string;
  member_lastname: string;
  member_email: string;
  member_title: string;
  manager_name: string;
  director_name: string;
  fiscal_quarter: string;
  role_id: number;
  member_status: string;

  constructor(
    id: number,
    member_employee_id: string,
    member_firstname: string,
    member_lastname: string,
    member_email: string,
    member_title: string,
    manager_name: string,
    director_name: string,
    fiscal_quarter: string,
    role_id: number,
    member_status: string
  ) {
    this.id = id;
    this.member_employee_id = member_employee_id;
    this.member_firstname = member_firstname;
    this.member_lastname = member_lastname;
    this.member_email = member_email;
    this.member_title = member_title;
    this.manager_name = manager_name;
    this.director_name = director_name;
    this.fiscal_quarter = fiscal_quarter;
    this.role_id = role_id;
    this.member_status = member_status;
  }
}

export class UserResponse {
  success: boolean;
  user: UserData;

  constructor(success: boolean, user: UserData) {
    this.success = success;
    this.user = user;
  }
}
