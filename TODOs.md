# TODOs
Limited tracking, I usually delete what I am done with.

## Backlog
- [ ] re-wire everything in main.js, using dependency injection.

## In Progress
- [ ] implement first concept for [structures-pipeline](#initial-structures-pipeline)
- [ ] turn tooltiptext into output stream, what's sent appears as appended line.

## Done

# Concepts
general concepts to be implemented next
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

### 4. Secondary Output Stream
Maaaaybe? Scans can reveal data in HDDs which are not allocated yet.

## secondary output stream"
"Tooltiptext" turned into a small terminal, with lines appearing as they are send to the stream. The feature can be unlocked after internal sensors have been used, for a small amount of power they feed the output stream. Feature to collapse the secondary output stream needs review.

## I/O Terminal
Main game element, a fully developed terminal. All information appears here, until feeds are turned off or re-routed to secondary output streams.