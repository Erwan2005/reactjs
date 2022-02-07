


export default class APIService {
    static url = 'http://127.0.0.1:8000/userapp/'
    
    static UpdateArticle(article_id, body, token) {

     return fetch(`http://127.0.0.1:8000/api/articles/${article_id}/`, {
        'method':'PUT',
        headers: {
            'Content-Type':'application/json',
            'Authorization':`Token ${token}` 
          }, 
          body:JSON.stringify(body)

     }).then(resp => resp.json())


    }

    static InsertPublication(body, token) {

      return fetch('http://127.0.0.1:8000/userapp/publication/', {
        'method':'POST',
        headers: {
            'Content-Type':'application/json',
            'Authorization':`Token ${token}` 
          }, 
          body:JSON.stringify(body)

      }).then(resp => resp.json())

    }

    static InsertLike(body) {

      return fetch('http://127.0.0.1:8000/userapp/like/', {
        'method':'POST',
        headers: {
            'Content-Type':'application/json',
          }, 
          body:JSON.stringify(body)

      }).then(resp => resp.json())

    }
    static DeleteLike(id) {

      return fetch(`http://127.0.0.1:8000/userapp/like/${id}`, {
        'method':'DELETE',
        headers: {
            'Content-Type':'application/json',
          }, 

      })

    }

    static InsertComment(body, token) {

      return fetch('http://127.0.0.1:8000/userapp/comment/', {
        'method':'POST',
        headers: {
            'Content-Type':'application/json',
          }, 
          body:JSON.stringify(body)

      }).then(resp => resp.json())

    }

    static DeletePublication(article_id, token) {

      return fetch(`http://127.0.0.1:8000/userapp/publication/${article_id}/`, {
        'method':'DELETE',
        headers: {
            'Content-Type':'application/json',
            'Authorization':`Token ${token}` 
          }

     })

    }

    static UserProfile(user_id) {

      return fetch(`http://127.0.0.1:8000/userapp/users/${user_id}/`, {
        'method':'GET',
        headers: {
            'Content-Type':'application/json',
          }

     })
      .then(resp => resp.json())
      //.then(resp => setArticles(resp))
      .catch(error => console.log(error))
    }

    static LoginUser(body) {

      return fetch('http://127.0.0.1:8000/authenticate/', {
        'method':'POST',
        headers: {
            'Content-Type':'application/json',
            
          }, 
          body:JSON.stringify(body)

      }).then(resp => resp.json())

    }


    static RegisterUser(body) {

      return fetch(this.url+'users/', {
        'method':'POST',
        headers: {
            'Content-Type':'application/json',
          }, 
          body:JSON.stringify(body)

      }).then(resp => resp.json())

    }

    static CheckUser(body, token) {

      return fetch('http://127.0.0.1:8000/polls/CheckUser/', {
        'method':'POST',
        headers: {
            'Content-Type':'application/json',
            'Authorization':`Token ${token}` 
          }, 
          body:JSON.stringify(body)

      }).then(resp => resp.json())

    }

    static GetcheckUser(token) {

      return fetch('http://127.0.0.1:8000/polls/CheckUser/', {
        'method':'GET',
        headers: {
            'Content-Type':'application/json',
            'Authorization':`Token ${token}` 
          }, 

      }).then(resp => resp.json())

    }

    static UserOffline(user_id, body, token) {

      return fetch(`http://127.0.0.1:8000/polls/CheckUser/${user_id}/`, {
        'method':'PUT',
        headers: {
            'Content-Type':'application/json',
            'Authorization':`Token ${token}` 
          }, 
          body:JSON.stringify(body)

      }).then(resp => resp.json())

    }

    static FriendRequest(body, token) {

      return fetch(`http://127.0.0.1:8000/polls/friendrequest/`, {
        'method':'POST',
        headers: {
            'Content-Type':'application/json',
            'Authorization':`Token ${token}` 
          }, 
          body:JSON.stringify(body)

      }).then(resp => resp.json())

    }


}