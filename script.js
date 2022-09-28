const APIURL = "https://api.github.com/users/";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username);

    createUserCard(data);
  } catch (err) {
    if (err.response.status == 404) {
      createErrorCard("There is no such user");
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + "/repos?sort=created");

    console.log(data);
    addReposToCard(data);
  } catch (err) {
    createErrorCard("Problem fetching repository");
  }
}

function createUserCard(user) {
  const cardHTML = `
    <div class="card">
        <div>
          <img
            src="${user.avatar_url}
            alt="${user.name}"
            class="avatar"
          />
        </div>
        <div class="userInfo">
          <h2>${user.name}</h2>
          <p>${user.bio}</p>
          <ul>
            <li>${user.followers} <strong>Followers</strong></li>
            <li>${user.following} <strong>Following</strong></li>
            <li>${user.public_repos} <strong>Repos</strong></li>
          </ul>
          <div id="repos"></div>
        </div>
      </div>
    `;
  main.innerHTML = cardHTML;
}

function createErrorCard(message) {
  const cardHTML = `
    <div class="card">
        <h1>${message}</h1>
    </div>
    `;
  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");

  repos
    .slice(1, 10) //reposları 1-10 arası kısalttık
    .forEach((repo) => {
      const repoEl = document.createElement("a");
      repoEl.classList.add("repo");
      repoEl.href = repo.html_url;
      repoEl.target = "_blank";
      repoEl.innerText = repo.name;
      reposEl.appendChild(repoEl);
    });
    console.log(reposEl);
}


// forma addlistener ekledik ve gönderiyi listener yaptık
//bunu bir tuşu aşağı indirirkende yapabiliriz ancak her tuşu aşağı indirdiğimizde requestte bulunmuş oluruz
form.addEventListener("submit", (e) => {
  e.preventDefault(); // preventDefault: olay açıkça işlenmezse, varsayılan eyleminin normalde olduğu gibi yapılmaması gerektiğini söyler.

  //default davraşınışı önlüyoruz, bir dosyaya göndermeyi deneyecek sonra arama değerine ayarlayacak

  const user = search.value;
  if (user) {
    getRepos(user);
    getUser(user);
    //kullanıcı olduğundan emin olmak istiyoruz, get user ile çağırıp kullaınıcıyı buraya aktarıyoruz

    search.value = "";
    //.value ara fakat hiçbirşey olarak bırakıyoruz
  }
});
