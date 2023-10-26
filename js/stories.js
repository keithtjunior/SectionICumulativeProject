"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
    return $(`
      <li id="${story.storyId}">
        <div class="story-list-item">
          <div class="story-list-item-left">
          <span class="story-favorite">${!currentUser ? '' : (isUserFavorite(story.storyId) ? '&#9733;' : '&#9734;')}</span>
          </div>
          <div class="story-list-item-center">
            <a href="${story.url}" target="a_blank" class="story-link">
              ${story.title}
            </a>
            <small class="story-hostname">(${hostName})</small>
            <small class="story-author">by ${story.author}</small>
            <small class="story-user">posted by ${story.username}</small>
          </div>
          <div class="story-list-item-right">
          ${!currentUser ? '' : (currentUser.username === story.username ? '<span class="story-delete">&#10005;</span>' : '')}
          </div>
        </div>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//!!!!!!!!!!!!!!!!!!!!ADD COMMENTS!!!!!!!!!!!!!!!!!!!!//

function putFavoriteStoriesOnPage() {
  if(!currentUser) return;

  console.debug("putFavoriteStoriesOnPage");
  $allStoriesList.empty();

  for (let story of storyList.stories) {
    currentUser.favorites.filter(fav => {
      if(fav.storyId === story.storyId){
        const $story = generateStoryMarkup(story);
        $allStoriesList.append($story);
      }
    })
  }
  $allStoriesList.show();
}

$navFavorites.on("click", putFavoriteStoriesOnPage);

//!!!!!!!!!!!!!!!!!!!!ADD COMMENTS!!!!!!!!!!!!!!!!!!!!//

async function submitStory(evt) {
  console.debug("submitStory", evt);
  evt.preventDefault();

  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();

  await storyList.addStory(currentUser, {title, author, url});
  
  $submitForm.trigger("reset");
  hidePageComponents();
  putStoriesOnPage();
}

$submitForm.on("submit", submitStory);

//!!!!!!!!!!!!!!!!!!!!ADD COMMENTS!!!!!!!!!!!!!!!!!!!!//

async function deleteStory(){
  if(!currentUser) return;
  let id = $(this).parents("li").attr("id");
  await storyList.deleteStory(currentUser, id);
  $(this).parents("li").remove();
}

$allStoriesList.on("click", "li .story-delete", deleteStory);



