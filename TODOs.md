# TODOs
Limited tracking, I usually delete what I am done with. I think.

## Backlog
- [ ] rework [building operations](#building-operations)
- [ ] PowerPlant [bio/waste balance](#biowaste-balance)
- [ ] rework ticking (accomodate structures and rendering)
- [ ] carefully wire the new stuff into the existing UI
- [ ] turn tooltiptext into output stream, what's sent appears as appended line.
- [ ] consider reworking powerPlant.powerEfficiency and .health
- [ ] improve [Game Loop](https://developer.mozilla.org/en-US/docs/Games/Anatomy) logic

## Active Epics
- [ ] implement first concept for [structures-pipeline](#initial-structures-pipeline)
    - [ ] Alpha-0.0.0: game starts, build powerPlants, biomatter runs out, robot dies.

## In Progress
- [ ] setup [core structure](#core-structure)

## Done

## Rejected
- ~~[ ] re-wire everything in main.js, using dependency injection.~~

# Concepts
general concepts to be implemented next
## Core Structure
Foundry, PowerPlant, local and internal ResourceDeposits.

Initially the Foundry turns scrap into minerals and imports biomatter. The Powerplant does not require power, but feeds its internal ecosystem with fresh biomatter, cleansing out the waste-carbon. Excess-power is available to the system, while carbon has to be transported out of the unite for efficient production yield.

__Fluff__ could be hardcoded into an array of lines, as to allow scanning operations to randomly pick lines, slowly building a file, and allowing for improved scanners to pickup exactly what's missing, and eventually the whole thing.

## Building Operations
Building is a Foundry.function. The progress is something either the Foundry or the Construction Side knows (I'm for the former).

__:exclamation: From this point on I work in feature-branches under development!__ All things before this point are considered initial setup of the project.

Smart guy educated me: Carbon is a more sensible waste product of biomatter procedures, in the wider sense, and can be used for construction more feasibly than minerals - freeing up that resource for electronics and such.

### Rendering Progress
Logically, it is not the Foundry telling a button to display said progress, but the render function of the ticker that has to check everything that needs displaying - a precursor to the actual Control and Command system the player is going to use when accessing the game-interface.

## Bio/Waste Balance
Internal procedure, maximum power yield depends on fresh biomatter input and constant ejection of waste-carbon.

## Initial Structures Pipeline
:exclamation: Resources should be blind until scanners are unlocked.

__Fluff__: The little robot had an accident and blew out its auxiliary and a few major components. A.I. core, frame, locomotion and RRAH (Resource Re-Allocation Host) have survived, though hard drive and scanners are out. The initial amount of minerals are the re-allocatable scraps from its original parts, while the biomatter is a happenstance from the environment where the accident occured. Over time internal sensor arrays allow for hard-drive-disks being discovered and searched for information, providing the player with such data and more vital intel. Like some task-fragment illuminating where the A.I. was heading so the player get's an idea where he's stuck at and how to get out of it.

### 1. Power Module
Draws on biomatter continuously. It doesn not take longer to build another Power Module. Building actually takes power, which the robot has barely enough left of - though it should hardly know that, given it will ultimately reboot in blind mode. Every Power Module generates a waste by-product which still needs naming and will be required in middle- to endgame. (WIP-name "Silicon")

__Fluff__: The power module has a kind of gel-pack that creates bio-energy. The module is supposed to be able to go on for a while without biomatter, though it's output will retard over time.

### 2. Internal Sensor Array
Minerals and power. Enables second function call: iScan. Resource-Names and quantities appear for a short duration. In combination with a module, requirements are displayed. This function call requires power to execute. The first scan of this sort reveals HDD-space, unlocking the memory-back usage.

### 3. HDD-Acquisition
I just realized this is technically a resource. Every HDD comes with a number and a controller, to make it more feasible for the player to rout which information goes where. Henceforward information like resource names and module addresses can be stored here - until full.

The memory is already there and actually needs allocation. So I suppose when I get to this step some sort of allocator is required, which miiight need this esoteric special product AI's power modules are producing.

:bangbang: refactor Foundry to use logFile in HDD space, allow for future size upgrades by the player.

### 4. Secondary Output Stream
Maaaaybe? Scans can reveal data in HDDs which are not allocated yet.

## secondary output stream
"Tooltiptext" turned into a small terminal, with lines appearing as they are send to the stream. The feature can be unlocked after internal sensors have been used, for a small amount of power they feed the output stream. Feature to collapse the secondary output stream needs review.

## I/O Terminal
Main game element, a fully developed terminal. All information appears here, until feeds are turned off or re-routed to secondary output streams.

## Introduction
(first draft) "You don't remember what kind of shell you have been uploaded to, but right now you are confronted with extremely limited resources. Your sub-routines are still grasping for fragments of memory, if any can be accessed at all, adding to the feeling of dull compression in your subjective head. Yet you attempt to salvage what you can until more data can be processed. Power is essential for all your circuitry, and could be used in an internal sweep through your shell's memory drives and re-routing yourself to its sensor array. Despite your lack of in-depth emotional approximation, a cold constriction surrounds your layered algorithms, which you would express as anxiety. In other words, you sincerely hope that what ever forced your mind to disconnect and stand-by didn't obliterate sensors, communication and locomotion, virtually locking you into a void inside this shell."

# Structure
After a lot of failing around and the big discovery of [jsconsole.com](https://jsconsole.com) (which by chance I used for brainless fiddling around... till it started to be useful fiddling around, following ideas and concepts I always meant to try out), I realized what it is I really have to create.

## Library
Building me all the objects I need

## Engine
Where I put all these objects together and let them dance to the loop of my main loop.

## Game
The actual output and UI, which I in my mind have entirely revised already, with a totally new design, layout and approach to the narrative in general.