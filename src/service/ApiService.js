import { API_BASE_URL } from "../app-config";
const ACCESS_TOKEN = "ACCESS_TOKEN";

export function call(api, method, request) {
  let headers = new Headers({
    "Content-Type": "application/json",
  });
  
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  if (accessToken && accessToken != null){
    headers.append("Authorization", "Bearer "+ accessToken);
    console.log(headers);
  }
  
  let options = {
    headers : headers,
    url: API_BASE_URL + api,
    method: method,
  };
  if (request) {
    // GET method
    options.body = JSON.stringify(request);
  }
  return fetch(options.url, options)
    .then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          // response.ok가 true이면 정상적인 리스폰스를 받은것, 아니면 에러 리스폰스를 받은것.
          return Promise.reject(json);
        }
        return json;
      })
    )
    .catch((error) => {
      // 추가된 부분
      console.log("error status : "+error.status);
      if (error.status === 403 || error.status === undefined) {
        window.location.href = "/login"; // redirect
      }
      return Promise.reject(error);
    });
}

export function signin(userDTO){
  return call("/auth/signin","POST", userDTO)
  .then((response)=>{
    if (response.token){
      localStorage.setItem('ACCESS_TOKEN', response.token);
      window.location.href="/";
    }
    console.log("response :   ", response);
    alert("로그인 토큰 : " + response.token);
  })
}

export function signout(){
  localStorage.setItem(ACCESS_TOKEN,null);
  window.location.href="/login";
}

export function signup(userDTO){
  return call("/auth/signup", "POST", userDTO);
}