// State
let allMovies = [];
let filteredMovies = [];
let activeTags = new Set();
let currentView = 'grid';
let searchQuery = '';

// Parse CSV data
function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const movies = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        const values = [];
        let current = '';
        let inQuotes = false;

        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());

        const movie = {};
        headers.forEach((header, index) => {
            movie[header] = values[index] || '';
        });

        if (movie['Start Time'] && !movie['Start Time'].includes('NEEDS_TIMING')) {
            movies.push(movie);
        }
    }

    return movies;
}

// Embedded CSV data - no server needed!
const EMBEDDED_CSV_DATA = `Title,Year,Type,Start Time,Midnight Scene,Tags,Notes
When Harry Met Sally,1989,Movie,10:30:27,Harry declares his love; midnight kiss to Auld Lang Syne,"Romance, New Year's",
Forrest Gump,1994,Movie,10:38:55,Forrest and Lt. Dan ring in the New Year together,"Drama, New Year's",
Ghostbusters II,1989,Movie,10:21:00,Statue of Liberty arrives / Happy New Year!,"Comedy, New Year's",
The Great Gatsby,2013,Movie,11:29:57,Gatsby raises his champagne glass,"Romance, Drama",
Wicked,2024,Movie,9:29:41,Defying Gravity climax,Musical,
Rocky,1976,Movie,10:30:42,Rocky reaches the top of the stairs,Inspirational,
The Godfather Part II,1974,Movie,10:22:30,Michael kisses Fredo at the New Year's party,"Drama, Dark, New Year's",Estimated timing
Ocean's Eleven,2001,Movie,10:32:30,Bellagio fountains finale,"Action, Comedy",Estimated timing
V for Vendetta,2005,Movie,9:57:04,Old Bailey explodes to the 1812 Overture,Action,
Fight Club,1999,Movie,10:35:00,Buildings collapse as Pixies play,Dark,
Avengers: Endgame,2019,Movie,9:29:30,Tony Stark snaps,Action,
Avengers: Endgame,2019,Movie,9:41:34,Captain America yells AVENGERS ASSEMBLE!,Action,Timed for assemble at midnight
Avengers: Infinity War,2018,Movie,9:48:54,Thanos snaps,"Action, Dark",
Harry Potter and the Deathly Hallows: Part 2,2011,Movie,10:10:05,Harry vs Voldemort final battle,Fantasy,
Die Hard,1988,Movie,9:56:47,Hans Gruber begins falling from Nakatomi Plaza,Action,
Die Hard,1988,Movie,9:56:27,Hans Gruber hits the ground,Action,Syncs with ball drop
Star Wars: A New Hope,1977,Movie,10:02:42,Death Star explodes,"Sci-Fi, Action",Blu-ray version
Star Wars: A New Hope,1977,Movie,10:02:43,Death Star explodes,"Sci-Fi, Action",Digital version
Star Wars: A New Hope,1977,Movie,10:02:48,Death Star explodes,"Sci-Fi, Action",DVD Special Edition
The Apartment,1960,Movie,10:55:00,Fran returns to Baxter,Romance,Estimated
Titanic,1997,Movie,11:40:00,Ship strikes the iceberg,"Romance, Dark",Disaster - optional
Back to the Future,1985,Movie,10:04:00,Lightning strike sends Marty home,Sci-Fi,
Back to the Future,1985,Movie,10:19:07,DeLorean hits 88mph sending Marty back,Sci-Fi,
The Lord of the Rings: Return of the King,2003,Movie,9:15:00,Mount Doom climax,Fantasy,Extended - very early start
The Matrix,1999,Movie,9:50:45,Neo flies / becomes The One,Sci-Fi,
The Matrix,1999,Movie,10:30:00,Neo fully becomes The One,Sci-Fi,Estimated
Jurassic Park,1993,Movie,10:04:00,T-Rex roars as banner falls,Action,
La La Land,2016,Movie,11:06:00,Epilogue fantasy sequence,Romance,
Casablanca,1942,Movie,10:55:00,Rick lets Ilsa go,Romance,Estimated
The Dark Knight,2008,Movie,10:15:00,Joker's final confrontation,"Action, Dark",Estimated
Independence Day,1996,Movie,10:00:00,Alien ships explode,Action,Estimated
Iron Man,2008,Movie,10:02:00,I am Iron Man,Action,
Mean Girls,2004,Movie,10:45:00,Spring Fling resolution,Comedy,Estimated
Clueless,1995,Movie,10:50:00,Cher and Josh get together,Comedy,Estimated
Home Alone,1990,Movie,10:25:00,Kevin reunited with his family,Family,Estimated
The Princess Bride,1987,Movie,10:55:00,As you wish,Romance,Estimated
Elf,2003,Movie,10:40:00,Central Park singing saves Christmas,Comedy,Estimated
The Truman Show,1998,Movie,10:20:00,Truman exits the dome,Drama,
2001: A Space Odyssey,1968,Movie,10:20:00,Star Child reveal,Sci-Fi,Estimated
Sleepless in Seattle,1993,Movie,10:45:00,Annie and Sam meet,Romance,Estimated
You've Got Mail,1998,Movie,10:50:00,Reveal in the park,Romance,Estimated
Four Weddings and a Funeral,1994,Movie,10:55:00,Rain confession,Romance,Estimated
About Time,2013,Movie,10:40:00,Tim learns to live fully,Romance,Estimated
Moonlight,2016,Movie,10:50:00,Final reunion,Drama,Estimated
Call Me By Your Name,2017,Movie,10:35:00,Fireplace monologue,Drama,Estimated
Eternal Sunshine of the Spotless Mind,2004,Movie,10:30:00,Meet me in Montauk,Romance,Estimated
Silver Linings Playbook,2012,Movie,10:45:00,Dance competition,Romance,Estimated
Little Women,2019,Movie,10:50:00,Jo's publishing triumph,Drama,Estimated
Brokeback Mountain,2005,Movie,10:55:00,Ennis at the closet,"Romance, Dark",Tragic ending
The Shawshank Redemption,1994,Movie,10:40:00,Andy and Red reunite,Drama,Estimated
Good Will Hunting,1997,Movie,10:50:00,It's not your fault,Drama,Estimated
Dead Poets Society,1989,Movie,10:45:00,O Captain My Captain,Drama,Estimated
Field of Dreams,1989,Movie,10:55:00,Hey Dad wanna have a catch?,Drama,Estimated
A Beautiful Mind,2001,Movie,10:50:00,Nobel Prize speech,Drama,Estimated
Whiplash,2014,Movie,10:35:00,Final drum solo,Drama,Estimated
Black Swan,2010,Movie,10:40:00,I was perfect,"Drama, Dark",Character death
The Social Network,2010,Movie,10:50:00,Refreshes page,Drama,Estimated
Oppenheimer,2023,Movie,10:30:00,Audience applause fades,Drama,Heavy themes
Mad Max: Fury Road,2015,Movie,10:20:00,Max disappears,Action,Estimated
Inception,2010,Movie,10:48:00,The spinning top,Sci-Fi,Estimated
Interstellar,2014,Movie,10:15:00,Bookshelf revelation,Sci-Fi,Estimated
Arrival,2016,Movie,10:40:00,Circular time reveal,Sci-Fi,Estimated
Dune: Part Two,2024,Movie,10:25:00,Paul ascends,Sci-Fi,Estimated
Rogue One,2016,Movie,10:45:00,Death Star fires,"Sci-Fi, Dark",Tragic ending
The Empire Strikes Back,1980,Movie,10:30:00,I am your father,Sci-Fi,Estimated
Return of the Jedi,1983,Movie,10:55:00,Victory celebration,Sci-Fi,Estimated
The Hunger Games,2012,Movie,10:50:00,Katniss wins,Action,Estimated
Scream,1996,Movie,10:45:00,Final reveal,Horror,
Halloween,1978,Movie,10:55:00,The boogeyman vanishes,Horror,
Get Out,2017,Movie,10:40:00,Escape ending,Horror,Estimated
A Quiet Place,2018,Movie,10:35:00,Regan fights back,Horror,Estimated
The Sixth Sense,1999,Movie,10:50:00,I see dead people payoff,Horror,Estimated
The Shining,1980,Movie,10:55:00,Frozen Jack,Horror,
School of Rock,2003,Movie,10:45:00,Battle of the Bands,Comedy,Estimated
The LEGO Movie,2014,Movie,10:40:00,Everything Is Awesome finale,Comedy,Estimated
The Muppet Movie,1979,Movie,10:50:00,Rainbow Connection reprise,Family,Estimated
The Sandlot,1993,Movie,10:55:00,Fireworks baseball,Family,Estimated
Napoleon Dynamite,2004,Movie,10:40:00,Dance performance,Comedy,Estimated
Superbad,2007,Movie,10:50:00,Grocery store farewell,Comedy,Estimated
Bridesmaids,2011,Movie,10:45:00,Friendship repaired,Comedy,Estimated
Bridesmaids,2011,Movie,10:57:36,I'm ready to party!,Comedy,
Toy Story,1995,Movie,10:50:00,Andy's birthday scare,Family,Estimated
Finding Nemo,2003,Movie,10:45:00,Reunion in the ocean,Family,Estimated
Ratatouille,2007,Movie,10:50:00,Ego tastes ratatouille,Family,Estimated
Wall-E,2008,Movie,10:40:00,Plant preserved,Family,Estimated
Coco,2017,Movie,10:45:00,Miguel sings Remember Me,Family,Estimated
The Incredibles,2004,Movie,10:55:00,Frozone chase,Family,Estimated
Groundhog Day,1993,Movie,10:40:00,Phil breaks the loop,Comedy,Estimated
Airplane!,1980,Movie,10:35:00,Absurd landing chaos,Comedy,Estimated
Anchorman,2004,Movie,10:45:00,News team brawl,Comedy,Estimated
The Big Lebowski,1998,Movie,10:50:00,The Dude abides,Comedy,Estimated
Ferris Bueller's Day Off,1986,Movie,10:55:00,Ferris beats his parents,Comedy,Estimated
Monty Python and the Holy Grail,1975,Movie,10:35:00,Police interrupt ending,Comedy,Estimated
Children of Men,2006,Movie,10:20:00,Ceasefire scene,Sci-Fi,Estimated
Blade Runner 2049,2017,Movie,10:35:00,K confronts truth,Sci-Fi,Estimated
Her,2013,Movie,10:45:00,Theodore says goodbye,Sci-Fi,Estimated
It's a Wonderful Life,1946,Movie,10:50:00,Bells ring for Clarence,Drama,Estimated
Paddington 2,2017,Movie,10:45:00,Prison pop-up book,Family,Estimated
Toy Story 3,2010,Movie,10:35:00,Andy says goodbye,Family,Estimated
Up,2009,Movie,10:10:00,Carl lets go,Family,Early start time
Inside Out,2015,Movie,10:15:00,Riley returns home,Family,Estimated
Love Actually,2003,Movie,10:30:00,Airport reunion montage,Romance,Estimated
The Notebook,2004,Movie,10:50:00,Elderly reveal,Romance,Estimated
Notting Hill,1999,Movie,10:50:00,Anna chooses William,Romance,Estimated
Pride & Prejudice,2005,Movie,10:52:00,Dawn proposal,Romance,Estimated
Before Sunrise,1995,Movie,11:00:00,Jesse & Céline's final walk,Romance,Estimated
Mamma Mia!,2008,Movie,10:39:20,Musical performance,Musical,
Lord of the Rings: Fellowship of the Ring,2003,Movie,9:51:30,Gandalf's You shall not pass!,Fantasy,
Lord of the Rings: Fellowship of the Ring,2003,Movie,11:41:57,Gandalf's fireworks,Fantasy,
Lord of the Rings: The Two Towers,2003,Movie,9:13:19,So it begins...,Fantasy,Extended - very early start
Kung Fu Panda,2008,Movie,10:40:14,Po says skadoosh,Family,
Kingsman: The Secret Service,2014,Movie,10:10:44,Heads start popping,"Action, Dark",Violent scene
Beetlejuice,1988,Movie,10:41:47,It's showtime!,Comedy,
Lethal Weapon,1987,Movie,11:39:54,I'm too old for this shit,Action,
Practical Magic,1998,Movie,11:12:00,Midnight margaritas with the Owens,Romance,
Alien,1979,Movie,11:03:38,Chestburster scene emerges from Kane,"Sci-Fi, Horror",
Doctor Who: The End of Time,2009,TV,10:15:00,Tenth Doctor regenerates,Sci-Fi,Estimated
Friends: The One with the Routine,1999,TV,10:45:00,Ross & Monica's dance,Comedy,Estimated
Seinfeld: The Strike,1997,TV,10:30:00,Festivus chaos peaks,Comedy,Estimated
The Office: Goodbye Michael,2011,TV,10:50:00,Michael leaves,Comedy,Estimated
Parks & Recreation: Two Parties,2012,TV,10:45:00,Leslie balances work & love,Comedy,Estimated
The Queen's Gambit,2020,TV,11:00:01,Beth Harmon's final chess match,Drama,Episode 7
How I Met Your Mother: The Limo,2006,TV,10:30:00,New Year's chaos escalates,"Comedy, New Year's",Estimated
Brooklyn Nine-Nine: The Box,2017,TV,10:40:00,Holt breaks suspect,Comedy,Estimated
Ted Lasso: Make Rebecca Great Again,2020,TV,10:45:00,Karaoke victory,Comedy,Estimated
The West Wing: Two Cathedrals,2001,TV,10:45:00,President Bartlet confronts God,Drama,Estimated
Breaking Bad: Felina,2013,TV,10:50:00,Walt's end,Drama,Estimated
Better Call Saul: Saul Gone,2022,TV,10:55:00,Jimmy confesses,Drama,Estimated
Succession: All the Bells Say,2021,TV,10:50:00,Boardroom finale,Drama,Estimated
Lost: The End,2010,TV,10:45:00,Church reunion,Drama,Estimated
Game of Thrones: The Winds of Winter,2016,TV,10:30:00,Sept explodes,"Fantasy, Dark",Estimated
Stranger Things: The Gate,2017,TV,10:40:00,Eleven closes the gate,Sci-Fi,Estimated - Season 2 finale
The Bear: Forks,2023,TV,10:35:00,Richie thrives,Drama,Estimated
Schitt's Creek: Happy Ending,2020,TV,10:55:00,Wedding vows,Comedy,Estimated
Futurama: Space Pilot 3000,1999,TV,11:58:08,New Year's countdown syncs with real life,"Comedy, New Year's",Episode 1
Star Trek: Voyager: Collective,2000,TV,11:49:35,Ensign Harry Kim kisses a cow,Sci-Fi,Season 6 Episode 17`;

// Load movies from embedded data
function loadMovies() {
    allMovies = parseCSV(EMBEDDED_CSV_DATA);
    filteredMovies = [...allMovies];
    initializeApp();
}

// Initialize the app
function initializeApp() {
    createStars();
    renderFilters();
    renderInteractiveTimeline();
    renderMovies();
    updateResultsCount();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    setInterval(() => renderMovies(), 60000);
}

// Convert time string to minutes for comparison
function timeToMinutes(timeStr) {
    if (!timeStr || timeStr === 'NEEDS_TIMING') return null;
    const parts = timeStr.split(':');
    let hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);

    if (hours < 12) hours += 12;
    return hours * 60 + minutes;
}

// Format minutes to time string
function minutesToTime(minutes) {
    let hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';

    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;

    return `${hours}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

// Get all unique tags
function getAllTags() {
    const tagsSet = new Set();
    allMovies.forEach(movie => {
        const tags = movie.Tags.split(',').map(t => t.trim()).filter(t => t);
        tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
}

// Render filter tags
function renderFilters() {
    const filtersContainer = document.getElementById('filters');
    const tags = getAllTags();

    filtersContainer.innerHTML = tags.map(tag => {
        const isDark = tag.toLowerCase() === 'dark';
        const className = `filter-tag ${isDark ? 'dark-tag' : ''}`;
        return `<button class="${className}" data-tag="${tag}">${tag}</button>`;
    }).join('');

    filtersContainer.querySelectorAll('.filter-tag').forEach(btn => {
        btn.addEventListener('click', () => {
            const tag = btn.dataset.tag;
            if (activeTags.has(tag)) {
                activeTags.delete(tag);
                btn.classList.remove('active');
            } else {
                activeTags.add(tag);
                btn.classList.add('active');
            }
            filterMovies();
        });
    });
}

// Check if device is touch-enabled
function isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

// Consolidate nearby times on mobile
function consolidateTimes(moviesByTime, isMobile) {
    if (!isMobile) return moviesByTime;

    // Convert to array and sort by time
    const timeEntries = Array.from(moviesByTime.entries())
        .map(([time, movies]) => ({
            time,
            minutes: timeToMinutes(time),
            movies
        }))
        .sort((a, b) => a.minutes - b.minutes);

    // Group times within 5 minutes of each other
    const consolidated = new Map();
    const threshold = 5; // minutes

    timeEntries.forEach(entry => {
        let merged = false;

        // Check if this time can be merged with an existing consolidated group
        for (let [consolidatedTime, data] of consolidated.entries()) {
            const timeDiff = Math.abs(entry.minutes - data.minutes);
            if (timeDiff <= threshold) {
                // Merge into this group
                data.movies.push(...entry.movies);
                merged = true;
                break;
            }
        }

        if (!merged) {
            // Create new group
            consolidated.set(entry.time, {
                minutes: entry.minutes,
                movies: [...entry.movies]
            });
        }
    });

    // Convert back to simple Map structure
    const result = new Map();
    consolidated.forEach((data, time) => {
        result.set(time, data.movies);
    });

    return result;
}

// Render interactive timeline
function renderInteractiveTimeline() {
    const markersContainer = document.getElementById('timelineMarkers');
    const track = document.getElementById('timelineTrack');
    const tooltip = document.getElementById('timelineTooltip');
    const hoverTime = document.getElementById('timelineHoverTime');

    // 9 PM = 21:00 = 1260 minutes, midnight = 24:00 = 1440 minutes
    const startMinutes = 21 * 60; // 9 PM
    const endMinutes = 24 * 60;   // midnight
    const range = endMinutes - startMinutes; // 180 minutes

    // Group movies by start time
    let moviesByTime = new Map();
    filteredMovies.forEach(movie => {
        const time = movie['Start Time'];
        if (!moviesByTime.has(time)) {
            moviesByTime.set(time, []);
        }
        moviesByTime.get(time).push(movie);
    });

    // Consolidate nearby times on mobile
    const isMobile = window.innerWidth <= 768;
    moviesByTime = consolidateTimes(moviesByTime, isMobile);

    // Create markers
    markersContainer.innerHTML = '';
    let activeMarker = null;

    moviesByTime.forEach((movies, time) => {
        const minutes = timeToMinutes(time);
        if (minutes < startMinutes || minutes > endMinutes) return;

        const position = ((minutes - startMinutes) / range) * 100;
        const marker = document.createElement('div');
        marker.className = 'timeline-marker';
        if (movies.length > 1) {
            marker.classList.add('multiple');
        }
        marker.style.left = `${position}%`;

        // Support both mouse and touch events
        if (isTouchDevice()) {
            // Touch: tap to toggle tooltip
            marker.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (activeMarker === marker) {
                    hideTooltip();
                    activeMarker = null;
                    marker.classList.remove('active');
                } else {
                    if (activeMarker) {
                        activeMarker.classList.remove('active');
                    }
                    showTooltip(movies, time, marker);
                    activeMarker = marker;
                    marker.classList.add('active');
                }
            });
        } else {
            // Mouse: hover to show tooltip
            marker.onmouseenter = () => {
                showTooltip(movies, time, marker);
            };

            marker.onmouseleave = () => {
                hideTooltip();
            };
        }

        markersContainer.appendChild(marker);
    });

    // Track hover/touch to show current time
    const updateTimeDisplay = (clientX) => {
        const rect = track.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        const minutes = startMinutes + (percent * range);
        const timeStr = minutesToTime(Math.round(minutes));
        hoverTime.textContent = timeStr;
    };

    track.addEventListener('mousemove', (e) => {
        if (!isTouchDevice()) {
            updateTimeDisplay(e.clientX);
        }
    });

    track.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            updateTimeDisplay(e.touches[0].clientX);
        }
    });

    track.addEventListener('mouseleave', () => {
        if (!isTouchDevice()) {
            hoverTime.textContent = '';
        }
    });

    track.addEventListener('touchend', () => {
        hoverTime.textContent = '';
    });

    // Close tooltip when tapping outside on touch devices
    if (isTouchDevice()) {
        document.addEventListener('touchstart', (e) => {
            if (!tooltip.contains(e.target) && !markersContainer.contains(e.target)) {
                hideTooltip();
                if (activeMarker) {
                    activeMarker.classList.remove('active');
                    activeMarker = null;
                }
            }
        });
    }

    // Show current time marker
    updateCurrentTimeLine();
}

// Show tooltip for timeline marker
function showTooltip(movies, time, marker) {
    const tooltip = document.getElementById('timelineTooltip');
    const isMobile = window.innerWidth <= 768;

    if (movies.length === 1) {
        const movie = movies[0];
        const tags = movie.Tags.split(',').map(t => t.trim()).filter(t => t);

        tooltip.innerHTML = `
            <div class="timeline-tooltip-title">${movie.Title} (${movie.Year})</div>
            <div class="timeline-tooltip-time">Start at ${movie['Start Time']}</div>
            <div class="timeline-tooltip-scene">${movie['Midnight Scene']}</div>
            <div class="timeline-tooltip-tags">
                ${tags.map(tag => `<span class="timeline-tooltip-tag">${tag}</span>`).join('')}
            </div>
        `;
    } else {
        // Get time range if consolidated on mobile
        const startTimes = [...new Set(movies.map(m => m['Start Time']))].sort();
        const timeDisplay = isMobile && startTimes.length > 1
            ? `Around ${time}`
            : `Start at ${time}`;

        // Show first 3 movies, then indicate more
        const movieList = movies.slice(0, 3).map(m => `• ${m.Title} (${m.Year})`).join('<br>');
        const moreText = movies.length > 3 ? `<br><em>+${movies.length - 3} more</em>` : '';

        tooltip.innerHTML = `
            <div class="timeline-tooltip-title">${movies.length} Movies</div>
            <div class="timeline-tooltip-time">${timeDisplay}</div>
            <div class="timeline-tooltip-scene">
                ${movieList}${moreText}
            </div>
        `;
    }

    // First, make tooltip visible but transparent to get its height
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'visible';

    const markerRect = marker.getBoundingClientRect();
    const tooltipHeight = tooltip.offsetHeight;

    if (isMobile) {
        // On mobile, position tooltip below the timeline track
        const track = document.getElementById('timelineTrack');
        const container = document.getElementById('timelineViz');
        const trackRect = track.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate position relative to the container
        const relativeTop = trackRect.bottom - containerRect.top + 10;

        tooltip.style.position = 'absolute';
        tooltip.style.top = `${relativeTop}px`;
        tooltip.style.left = '1rem';
        tooltip.style.right = '1rem';
    } else {
        // Desktop: position above the marker using fixed positioning
        tooltip.style.position = 'fixed';
        const tooltipWidth = tooltip.offsetWidth;
        let left = markerRect.left + (markerRect.width / 2);
        let top = markerRect.top - tooltipHeight - 20;

        // Viewport boundary detection
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Check if tooltip goes off left edge
        if (left - (tooltipWidth / 2) < 10) {
            left = (tooltipWidth / 2) + 10;
        }

        // Check if tooltip goes off right edge
        if (left + (tooltipWidth / 2) > viewportWidth - 10) {
            left = viewportWidth - (tooltipWidth / 2) - 10;
        }

        // Check if tooltip goes off top edge (position below instead)
        if (top < 10) {
            top = markerRect.bottom + 20;
            // Update arrow direction in this case would require CSS class toggle
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    tooltip.style.visibility = 'visible';
    tooltip.classList.add('visible');
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.getElementById('timelineTooltip');
    tooltip.classList.remove('visible');
    tooltip.style.visibility = 'hidden';
}

// Update current time line on timeline
function updateCurrentTimeLine() {
    const currentTimeLine = document.getElementById('currentTimeLine');
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const startMinutes = 21 * 60; // 9 PM
    const endMinutes = 24 * 60;   // midnight
    const range = endMinutes - startMinutes;

    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
        const position = ((currentMinutes - startMinutes) / range) * 100;
        currentTimeLine.style.left = `${position}%`;
        currentTimeLine.classList.add('visible');
    } else {
        currentTimeLine.classList.remove('visible');
    }
}

// Filter movies
function filterMovies() {
    filteredMovies = allMovies.filter(movie => {
        // Search filter
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                movie.Title.toLowerCase().includes(searchLower) ||
                movie['Midnight Scene'].toLowerCase().includes(searchLower) ||
                movie.Tags.toLowerCase().includes(searchLower);
            if (!matchesSearch) return false;
        }

        // Tag filter
        if (activeTags.size > 0) {
            const movieTags = movie.Tags.split(',').map(t => t.trim());
            const hasActiveTags = Array.from(activeTags).some(tag =>
                movieTags.includes(tag)
            );
            if (!hasActiveTags) return false;
        }

        // Filter out "Dark" tagged movies unless explicitly selected
        const movieTags = movie.Tags.split(',').map(t => t.trim());
        if (movieTags.includes('Dark') && !activeTags.has('Dark')) {
            return false;
        }

        return true;
    });

    renderInteractiveTimeline();
    renderMovies();
    updateResultsCount();
}

// Get available movies (can still be started)
function getAvailableMovies() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return filteredMovies.filter(movie => {
        const startMinutes = timeToMinutes(movie['Start Time']);
        return startMinutes && startMinutes >= currentMinutes;
    });
}

// Render movie card
function renderMovieCard(movie) {
    const tags = movie.Tags.split(',').map(t => t.trim()).filter(t => t);

    return `
        <div class="movie-card fade-in">
            <div class="movie-type">${movie.Type}</div>
            <h3 class="movie-title">${movie.Title}</h3>
            <div class="movie-year">${movie.Year}</div>
            <div class="movie-time">Start at ${movie['Start Time']} PM</div>
            <p class="movie-scene">${movie['Midnight Scene']}</p>
            <div class="movie-tags">
                ${tags.map(tag => `
                    <span class="tag ${tag === 'Dark' ? 'dark' : ''}">${tag}</span>
                `).join('')}
            </div>
        </div>
    `;
}

// Render timeline item (grouped by time)
function renderTimelineItems() {
    // Group movies by start time
    const moviesByTime = new Map();
    const sortedByTime = [...filteredMovies].sort((a, b) => {
        return timeToMinutes(a['Start Time']) - timeToMinutes(b['Start Time']);
    });

    sortedByTime.forEach(movie => {
        const time = movie['Start Time'];
        if (!moviesByTime.has(time)) {
            moviesByTime.set(time, []);
        }
        moviesByTime.get(time).push(movie);
    });

    // Render grouped items
    const items = [];
    moviesByTime.forEach((movies, time) => {
        if (movies.length === 1) {
            const movie = movies[0];
            items.push(`
                <div class="timeline-item">
                    <div class="timeline-time">${time} PM</div>
                    <div class="timeline-title">${movie.Title} (${movie.Year})</div>
                    <div class="timeline-scene">${movie['Midnight Scene']}</div>
                </div>
            `);
        } else {
            items.push(`
                <div class="timeline-item">
                    <div class="timeline-time">${time} PM</div>
                    <div class="timeline-title">${movies.length} Movies at this time:</div>
                    <div class="timeline-scene">
                        ${movies.map(m => `• ${m.Title} (${m.Year}) — ${m['Midnight Scene']}`).join('<br>')}
                    </div>
                </div>
            `);
        }
    });

    return items.join('');
}

// Render movies
function renderMovies() {
    const availableGrid = document.getElementById('availableGrid');
    const moviesGrid = document.getElementById('moviesGrid');
    const timelineView = document.getElementById('timeline');

    const availableMovies = getAvailableMovies();

    // Available movies
    if (availableMovies.length > 0) {
        availableGrid.innerHTML = availableMovies
            .slice(0, 6)
            .map(renderMovieCard)
            .join('');
        document.getElementById('availableSection').style.display = 'block';
    } else {
        document.getElementById('availableSection').style.display = 'none';
    }

    // All movies
    if (filteredMovies.length > 0) {
        moviesGrid.innerHTML = filteredMovies.map(renderMovieCard).join('');
    } else {
        moviesGrid.innerHTML = `
            <div class="empty-state">
                <div class="icon">🎬</div>
                <p>No movies found matching your filters</p>
            </div>
        `;
    }

    // Timeline (grouped)
    timelineView.innerHTML = renderTimelineItems();
}

// Update results count
function updateResultsCount() {
    const count = document.getElementById('resultsCount');
    count.textContent = `${filteredMovies.length} movie${filteredMovies.length !== 1 ? 's' : ''}`;
}

// Update current time
function updateCurrentTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    document.getElementById('currentTime').textContent = timeStr;

    // Calculate time until midnight
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown').textContent =
        `${hours}h ${minutes}m ${seconds}s until midnight`;

    // Update timeline current time marker
    updateCurrentTimeLine();
}

// Create starfield
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (2 + Math.random() * 2) + 's';
        starsContainer.appendChild(star);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value;
        filterMovies();
    });

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            currentView = view;

            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (view === 'timeline') {
                document.getElementById('timelineView').classList.remove('hidden');
                document.getElementById('moviesGrid').parentElement.style.display = 'none';
            } else {
                document.getElementById('timelineView').classList.add('hidden');
                document.getElementById('moviesGrid').parentElement.style.display = 'block';
            }
        });
    });

    // Load movies
    loadMovies();
});
