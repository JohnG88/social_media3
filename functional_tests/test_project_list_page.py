from django.contrib.auth import get_user_model
from selenium import webdriver
from chatting.models import Post
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from django.urls import reverse
import time

User = get_user_model()

class TestProjectListPage(StaticLiveServerTestCase):

    '''You can add login functionality to setUp function and run each test and it will work, or you can create a login function and call it to each test'''

    def setUp(self):
        # Fire a browser
        self.browser = webdriver.Chrome('functional_tests/chromedriver.exe')
        self.user = User.objects.create_user('Billy', 'billy@gmail.com', 'somepassword')

        # self.browser.get(self.live_server_url)

        # username = self.browser.find_element('name', 'username')
        # username.send_keys(self.user.username)

        # password = self.browser.find_element('name', 'password')
        # password.send_keys('somepassword')
        # time.sleep(5)
        # password.submit()

    def tearDown(self):
        self.browser.close()

    def login_page_creds(self):
        
        self.browser.get(self.live_server_url)

        username = self.browser.find_element('name', 'username')
        username.send_keys(self.user.username)

        password = self.browser.find_element('name', 'password')
        password.send_keys('somepassword')
        # time.sleep(5)
        password.submit()
        # return

    def test_display_login(self):
        # locate server
        self.browser.get(self.live_server_url)
        
        alert = self.browser.find_element('class name', 'form-center')
        self.assertEquals(
            alert.find_element('tag name', 'button').text, 'Login'
        )
    
    # # Below logs into page, shows index page, added '/' because current_url has it
    def test_logged_in_redirect_to_index_page(self):
        self.login_page_creds()
        # print(self.test_display_login())
        self.browser.get(self.live_server_url)

        index_url = self.live_server_url

        # self.browser.find_element('tag name', 'button').click()
        self.assertEquals(
            self.browser.current_url,
            index_url + '/'
        )

    def test_user_sees_post_list(self):
        post1 = Post.objects.create(
            user=self.user,
            content='First Post'
        )

        self.login_page_creds()

        self.browser.get(self.live_server_url)

        self.assertEquals(
            self.browser.find_element('class name', 'card-text').text,
            'First Post'
        )

    def test_user_is_redirected_to_post_detail(self):
        post1 = Post.objects.create(
            user=self.user,
            content='First Post'
        )

        self.login_page_creds()

        self.browser.get(self.live_server_url)

        # user clicks on view post link and is redirected to view post page
        
        detail_url = self.live_server_url + reverse('single-post', args=[post1.id])

        self.browser.find_element('link text', 'View Post').click()
        time.sleep(5)
        self.assertEquals(
            self.browser.current_url,
            detail_url
        )

    def test_if_post_will_post(self):
        post1 = Post.objects.create(
            user=self.user,
            content='First Post'
        )

        self.login_page_creds()

        self.browser.get(self.live_server_url)

        content = self.browser.find_element('name', 'content')
        content.send_keys('Second Post')
        time.sleep(5)
        content.submit()
        time.sleep(5)
        
        # to find element with multiple of same attribute use find_elements, index starts at 0
        self.assertEquals(
            self.browser.find_elements('class name', 'card-text')[0].text,
            'Second Post'
        )

