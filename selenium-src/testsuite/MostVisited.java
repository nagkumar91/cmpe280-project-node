package testsuite;

import org.testng.annotations.Test;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeTest;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Action;
import org.openqa.selenium.interactions.Actions;
import org.testng.annotations.AfterTest;

public class MostVisited {
  @Test
  public void mostvisitedpage() throws InterruptedException {
	  WebDriver driver  = new ChromeDriver();
		Actions builder = new Actions(driver);
	        driver.get("http://cmpe280-node.nagkumar.com:3000/");
	        //System.out.println("=======Test Case 1 passed : localhost:3000 opened in new Chrome Window=======");
	        try {
				Thread.sleep(2000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
	  WebElement most_visited_link = driver.findElement(By.id("mostVisited"));
      Thread.sleep(2000);
      
      Action mouseOvermost_visited_link = builder.moveToElement(most_visited_link).build();
      mouseOvermost_visited_link.perform(); 
      Thread.sleep(2000);
      driver.findElement(By.id("mostVisited")).click();
      Thread.sleep(1000);
      WebElement most_Visited_button = driver.findElement(By.id("datePicked"));
      Action mouse_most_VisitedOverDatePicker = builder.moveToElement(most_Visited_button).build();
      mouse_most_VisitedOverDatePicker.perform(); 
      Thread.sleep(2000);
      driver.findElement(By.id("datePicked")).click();
      Thread.sleep(2000);
      
      driver.findElement(By.linkText("6")).click();
      Thread.sleep(4000);
	  driver.quit();
	  
  }
  @BeforeMethod
  public void beforeMethod() {
  }

  @BeforeClass
  public void beforeClass() {
  }

  @BeforeTest
  public void beforeTest() {
	  System.setProperty("webdriver.chrome.driver", "C://Users//Sagar//Downloads//chromedriver_win32//chromedriver.exe");
		
  }

  @AfterTest
  public void afterTest() {
  }

}
