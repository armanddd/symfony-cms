<?php
namespace App\Controller;

use App\Entity\Pages;
use Doctrine\DBAL\Exception;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use App\Util\CheckRedirections;

class ManagementController extends AbstractController
{
    private $requestStack;
    private $userSession;

    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
        $this->userSession = $this->requestStack->getSession();
        $this->userSession->start();
    }
    /**
     * @Route("/cms/{page_name}", name="cms_management")
     * @Route("/", name="cms_management2")
     * @Route("/cms", name="cms_management3")
     */
    public function cms(EntityManagerInterface $entityManager, CheckRedirections $cr, RequestStack $requestStack) :Response{
        //check for logged in user

        $user = $entityManager->getRepository('App\Entity\User');
        $user = $user->findOneBy(['id' => $requestStack->getSession()->get('id')]);

        $em = $entityManager->getRepository('App\Entity\Pages');
        $userPages = $em->findBy(['user_id' => $user]);


        /*REDIRECTIONS TOWARDS THE FIRST PAGE*/
        //REDIRECT IN CASE USER HAS NO PAGES
        if (empty($userPages)) return $this->redirectToRoute('pages_management');
        //REDIRECT IN CASE OF JUST "/cms" URI
        else if ($requestStack->getCurrentRequest()->server->get('REQUEST_URI') == "/cms") return $this->redirectToRoute('cms_management', ['page_name' => $userPages[0]->getPageRoute()]);
        //REDIRECT IN CASE OF WRONG URI
        $loopIndex = 0; // index to find last element
        foreach ($userPages as $page){
            //EXIT LOOP IF URI IS ACTUALLY GOOD
            if ($page->getPageRoute() == $requestStack->getCurrentRequest()->attributes->get('page_name')){
                break;
            }
            //IF LAST INDEX AND STILL NO GOOD URI, REDIRECT TO FIRST PAGE AVAILABLE
            if(++$loopIndex === count($userPages)) {
                return $this->redirectToRoute('cms_management', ['page_name' => $userPages[0]->getPageRoute()]);
            }
        }
        /*REDIRECTIONS TOWARDS THE FIRST PAGE*/


        return $this->render('cms/cms.html.twig', [
            'username' => $this->userSession->get('username'),
            'pages' => $userPages,
            'page' => $page
        ]);
    }

    /**
     * @Route ("/pages_management", name="pages_management")
     */
    public function pages(EntityManagerInterface $entityManager, CheckRedirections $cr){
        if (!$cr->checkCMSUser()) return $this->redirectToRoute('login');

        $em = $entityManager->getRepository('App\Entity\Pages');
        $pages = $em->findAll();

        return $this->render('routing/pages-management.html.twig', [
            'username' => $this->userSession->get('username'),
            'pages' => $pages
        ]);
    }

    /**
     * @Route ("/page_creation", name="page_creation", methods={"POST"})
     */
    public function pageCreation(EntityManagerInterface $entityManager, CheckRedirections $cr, RequestStack $requestStack){
        if (!$cr->checkCMSUser()) return $this->redirectToRoute('login');

        $em = $entityManager->getRepository('App\Entity\User');
        $user = $em->findOneBy(['id' => $requestStack->getSession()->get('id')]);

        $page = new Pages();
        $page->setPageName($requestStack->getCurrentRequest()->request->get('pageName'));
        $page->setPageRoute($requestStack->getCurrentRequest()->request->get('routeName'));
        $page->setUserId($user);

        $entityManager->persist($page);
        $entityManager->flush();

        return $this->redirectToRoute('pages_management');
    }

    /**
     * @Route ("/page_deletion", name="page_deletion", methods={"POST"})
     */
    public function pageDeletion(EntityManagerInterface $entityManager, CheckRedirections $cr, RequestStack $requestStack){
        if (!$cr->checkCMSUser()) return $this->redirectToRoute('login');

        $em = $entityManager->getRepository('App\Entity\Pages');

        $page = $em->findOneBy(['id' => $requestStack->getCurrentRequest()->request->get('pageId')]);

        $entityManager->remove($page);
        $entityManager->flush();

        return $this->redirectToRoute('pages_management');
    }

    /**
     * @Route("/site_preview/{page_name}", name="site_preview")
     */
    public function sitePreview(CheckRedirections $cr, EntityManagerInterface $entityManager, RequestStack $requestStack){
        if (!$cr->checkCMSUser()) return $this->redirectToRoute('login');

        $pages = $entityManager->getRepository('App\Entity\Pages')->findAll();
        $page = $entityManager->getRepository('App\Entity\Pages')->findOneBy(['page_route' => $requestStack->getCurrentRequest()->attributes->get('page_name'),
            'user_id' => $this->userSession->get('id')]);

        return $this->render('site_preview/site_preview.html.twig', [
            'username' => $this->userSession->get('username'),
            'pages' => $pages,
            'page' => $page
        ]);
    }

    /**
     * @Route("/page_update", name="page_update")
     */
    public function pageUpdate(CheckRedirections $cr, RequestStack $requestStack, EntityManagerInterface $entityManager){
        if (!$cr->checkCMSUser()) return $this->redirectToRoute('login');

        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');

        $em = $entityManager->getRepository('App\Entity\Pages');

        $page = $em->findOneBy(['id' => $requestStack->getCurrentRequest()->request->get('pageId')]);
        $page->setContent($requestStack->getCurrentRequest()->request->get("content"));
        try {
            $entityManager->flush();
            return new Response("success");
        } catch (Exception $e) {
            return new Response("failure");
        }
    }

//    /**
//     * @Route("/json_api", name="json_test")
//     */
//    public function jsonTest() : Response{
//        $response = new Response();
//        $response->setContent(json_encode([
//            'data' => 123,
//        ]));
//        $response->headers->set('Content-Type', 'application/json');
//        return $response;
//    }
}